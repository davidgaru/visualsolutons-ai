/** Run: npx sanity exec scripts/optimize-cms-media.ts --with-user-token */
import { getCliClient } from "sanity/cli";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, stat, rename } from "node:fs/promises";
import { resolve, join } from "node:path";
import { tmpdir } from "node:os";

const run = promisify(execFile);
type Delivery = { desktop: string; compact: string; poster: string };
type ProjectMedia = { title: string; asset: { _id: string; url: string; size: number }; poster?: string };

async function main() {
  const client = getCliClient({ apiVersion: "2025-01-01" }).withConfig({ useCdn: false });
  const projects = await client.fetch<ProjectMedia[]>(
    '*[_type == "project" && defined(videoFile.asset)]{title,"asset":videoFile.asset->{_id,url,size},"poster":posterImage.asset->url}'
  );
  const cache = join(tmpdir(), "visualsolutions-cms-encodes");
  await mkdir(cache, { recursive: true });
  const manifest: Record<string, Delivery> = {};
  const report = [];
  for (const project of projects) {
    const { asset } = project;
    if (!asset?.url || manifest[asset.url]) continue;
    const hash = createHash("sha256").update(asset.url).digest("hex").slice(0, 16);
    const input = join(cache, `${hash}-original.mp4`);
    try { await stat(input); } catch {
      const response = await fetch(asset.url, { signal: AbortSignal.timeout(120000) });
      if (!response.ok) throw new Error(`Download failed: ${project.title}`);
      await writeFile(input, Buffer.from(await response.arrayBuffer()));
    }
    const probe = async (file: string) => JSON.parse((await run("ffprobe", [
      "-v", "quiet", "-show_format", "-show_streams", "-of", "json", file
    ])).stdout);
    const original = await probe(input);
    const video = original.streams.find((stream: { codec_type: string }) => stream.codec_type === "video");
    const delivery: Delivery = { desktop: "", compact: "", poster: project.poster || "" };
    const sizes: Record<string, number | string> = {
      title: project.title, originalAssetId: asset._id, originalBytes: asset.size,
      durationSeconds: Number(original.format.duration)
    };
    for (const variant of ["desktop", "compact"] as const) {
      const version = variant === "compact" ? "v2" : "v1";
      const output = join(cache, `${hash}-${variant}-${version}.mp4`);
      let complete = false;
      try {
        const cached = await probe(output);
        complete = Math.abs(Number(cached.format.duration) - Number(original.format.duration)) <= 0.15;
      } catch { /* An interrupted encode must be regenerated. */ }
      if (!complete) {
        const temporary = `${output}.partial.mp4`;
        await run("ffmpeg", [
          "-hide_banner", "-loglevel", "error", "-y", "-i", input,
          "-map", "0:v:0", "-map", "0:a?", "-vf",
          variant === "compact" ? "scale=w='min(960,iw)':h=-2:force_divisible_by=2" : "scale=w=iw:h=-2:force_divisible_by=2",
          "-c:v", "libx264", "-preset", "medium", "-crf", variant === "compact" ? "23" : "20",
          ...(variant === "compact" ? ["-maxrate", "1600k", "-bufsize", "3200k"] : []),
          "-pix_fmt", "yuv420p", "-threads", "4", "-c:a", "aac", "-b:a", "128k",
          "-movflags", "+faststart", temporary
        ]);
        await rename(temporary, output);
      }
      if (variant === "desktop" && video.codec_name === "h264" && video.pix_fmt === "yuv420p" && (await stat(output)).size > asset.size) {
        await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", input, "-c", "copy", "-movflags", "+faststart", output]);
      }
      const result = await probe(output);
      const resultVideo = result.streams.find((stream: { codec_type: string }) => stream.codec_type === "video");
      if (resultVideo.codec_name !== "h264" || resultVideo.pix_fmt !== "yuv420p") {
        throw new Error(`Unsupported delivery codec: ${project.title}`);
      }
      if (Math.abs(Number(result.format.duration) - Number(original.format.duration)) > 0.15) {
        throw new Error(`Duration changed: ${project.title}`);
      }
      if (variant === "desktop" && (video.width !== resultVideo.width || Math.abs(video.height - resultVideo.height) > 1)) {
        throw new Error(`Desktop dimensions changed: ${project.title}`);
      }
      if (original.streams.some((s: { codec_type: string }) => s.codec_type === "audio") &&
        !result.streams.some((s: { codec_type: string }) => s.codec_type === "audio")) {
        throw new Error(`Audio missing: ${project.title}`);
      }
      const sourceId = `${asset._id}-${variant}-${version}`;
      const existing = await client.fetch<{ url: string } | null>(
        '*[_type == "sanity.fileAsset" && source.id == $sourceId][0]{url}', { sourceId }
      );
      const uploaded = existing || await client.assets.upload("file", await readFile(output), {
        filename: `${hash}-${variant}.mp4`,
        source: { name: "Visual Solutions video delivery", id: sourceId, url: asset.url }
      });
      delivery[variant] = uploaded.url;
      sizes[`${variant}Bytes`] = (await stat(output)).size;
    }
    manifest[asset.url] = delivery;
    report.push(sizes);
    await writeFile(resolve("lib/cms-media-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
    await writeFile(resolve("docs/cms-media-sizes.json"), JSON.stringify(report, null, 2) + "\n");
    console.log(JSON.stringify(sizes));
  }
  console.log(`Prepared ${Object.keys(manifest).length} CMS video deliveries; original document references preserved.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "CMS media optimization failed");
  process.exitCode = 1;
});
