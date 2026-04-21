"use client";

import { Suspense } from "react";
import BookPageContent from "./BookPageContent";

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#09090d] text-white">
          <div className="text-sm text-[#686878]">Loading...</div>
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}
