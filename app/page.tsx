"use client";
import RecognizeFace from "@/components/RecognizeFace";
import SaveFacialDescriptions from "@/components/SaveFacialDescriptions";

export default function Home() {

  return (
    <main className="flex min-h-screen items-center justify-between p-24 gap-5">
        <SaveFacialDescriptions/>
        <RecognizeFace/>
    </main>
  );
}
