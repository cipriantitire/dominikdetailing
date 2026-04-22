// Backwards-compatible export for other parts of the app that may import the
// photo list directly. This file re-exports the canonical galleryItems so the
// rest of the codebase has a single import path if needed.
import { galleryItems } from "./gallery";

export default galleryItems;
