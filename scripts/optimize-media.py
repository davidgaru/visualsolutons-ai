"""Generate browser-ready delivery files without modifying the source footage.

Run with Python 3 and ffmpeg installed. Content hashes make CDN caching safe.
"""
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/videos/optimized"
OUTPUT.mkdir(parents=True, exist_ok=True)
manifest = {}
report = []

for source in sorted((ROOT / "public/videos").rglob("*")):
    if source.suffix.lower() not in {".mp4", ".mov"} or OUTPUT in source.parents:
        continue
    digest = hashlib.sha256(source.read_bytes() + b"delivery-v1").hexdigest()[:16]
    entry = {}
    for name, width, crf in [("desktop", None, 20), ("compact", 960, 23)]:
        target = OUTPUT / f"{digest}-{name}.mp4"
        if not target.exists():
            subprocess.run([
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
                "-map", "0:v:0", "-map", "0:a?", "-vf",
                (f"scale=w='min({width},iw)':h=-2:force_divisible_by=2" if width else "scale=w=iw:h=-2:force_divisible_by=2"),
                "-c:v", "libx264", "-preset", "slow", "-crf", str(crf),
                "-pix_fmt", "yuv420p", "-threads", "2", "-c:a", "aac", "-b:a", "128k",
                "-movflags", "+faststart", str(target)
            ], check=True)
        # Already efficient MP4s can grow when re-encoded. Retain their original
        # quality and bitrate while moving metadata forward for streaming.
        if name == "desktop" and source.suffix.lower() == ".mp4" and target.stat().st_size > source.stat().st_size:
            subprocess.run([
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
                "-c", "copy", "-movflags", "+faststart", str(target)
            ], check=True)
        entry[name] = "/" + str(target.relative_to(ROOT / "public"))
    poster = OUTPUT / f"{digest}-poster.jpg"
    if not poster.exists():
        subprocess.run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
            "-frames:v", "1", "-vf", "scale=w='min(960,iw)':h=-2",
            "-q:v", "4", str(poster)
        ], check=True)
    entry["poster"] = "/" + str(poster.relative_to(ROOT / "public"))
    url = "/" + str(source.relative_to(ROOT / "public"))
    manifest[url] = entry
    row = {"source": url, "originalBytes": source.stat().st_size,
           "desktopBytes": (ROOT / "public" / entry["desktop"].lstrip("/")).stat().st_size,
           "compactBytes": (ROOT / "public" / entry["compact"].lstrip("/")).stat().st_size}
    report.append(row)
    print(json.dumps(row), flush=True)

(ROOT / "lib/media-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
(ROOT / "docs/media-sizes.json").write_text(json.dumps(report, indent=2) + "\n")
