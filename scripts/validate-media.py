"""Verify delivery footage preserves duration, dimensions and streaming metadata."""
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / "lib/media-manifest.json").read_text())

def probe(url):
    return json.loads(subprocess.check_output([
        "ffprobe", "-v", "quiet", "-show_format", "-show_streams", "-of", "json",
        str(ROOT / "public" / url.lstrip("/"))
    ]))

for source, deliveries in manifest.items():
    original = probe(source)
    original_video = next(s for s in original["streams"] if s["codec_type"] == "video")
    for variant in ["desktop", "compact"]:
        result = probe(deliveries[variant])
        video = next(s for s in result["streams"] if s["codec_type"] == "video")
        assert video["codec_name"] == "h264", source
        assert video["pix_fmt"] == "yuv420p", source
        assert abs(float(result["format"]["duration"]) - float(original["format"]["duration"])) < 0.15, source
        if variant == "desktop":
            assert video["width"] == original_video["width"], source
            assert abs(video["height"] - original_video["height"]) <= 1, source
        else:
            assert video["width"] <= 960, source
            assert abs(video["width"] / video["height"] - original_video["width"] / original_video["height"]) < 0.02, source
        if any(s["codec_type"] == "audio" for s in original["streams"]):
            assert any(s["codec_type"] == "audio" for s in result["streams"]), source
        # Parse top-level ISO BMFF atoms: moov must precede media payload.
        data = (ROOT / "public" / deliveries[variant].lstrip("/")).read_bytes()
        offset, atoms = 0, []
        while offset + 8 <= len(data):
            size = int.from_bytes(data[offset:offset + 4], "big")
            atoms.append(data[offset + 4:offset + 8])
            if size == 1:
                size = int.from_bytes(data[offset + 8:offset + 16], "big")
            if size == 0:
                break
            offset += size
        assert atoms.index(b"moov") < atoms.index(b"mdat"), source
    assert (ROOT / "public" / deliveries["poster"].lstrip("/")).is_file(), source

print(f"Verified {len(manifest)} original clips and {len(manifest) * 2} delivery videos: full duration, desktop resolution, audio, H.264 compatibility, fast-start metadata and posters.")
