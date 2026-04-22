import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

// Note: the second parameter's shape varies between dev/edge contexts. Use
// an allowed `any` here — the file is a small, deliberate bridge to serve
// image binaries from docs/gallery-photos. The eslint rule is disabled for
// this line only because Next's runtime types differ between environments.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(_req: NextRequest, context: any) {
  const slug = context?.params?.slug;
  if (!slug || (Array.isArray(slug) && slug.length === 0)) {
    return new Response("Not Found", { status: 404 });
  }

  // Reconstruct the filename
  const filename = Array.isArray(slug) ? slug.join("/") : String(slug);

  // Restrict serving to the docs/gallery-photos directory to avoid accidental exposure
  const galleryRoot = path.resolve(process.cwd(), "docs", "gallery-photos");
  const filePath = path.resolve(galleryRoot, filename);

  // Basic safety: ensure file is inside galleryRoot
  if (!filePath.startsWith(galleryRoot)) return new Response("Forbidden", { status: 403 });

  try {
    const data = await fs.promises.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType =
      ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".png"
        ? "image/png"
        : ext === ".webp"
        ? "image/webp"
        : "application/octet-stream";

    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache images aggressively in production
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    return new Response("Not Found", { status: 404 });
  }
}
