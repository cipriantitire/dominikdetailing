"use client";

import { Suspense } from "react";
import BookPageContent from "./BookPageContent";

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
          <div className="text-sm text-[#a3a3a3]">Loading...</div>
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}
