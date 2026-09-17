"use client";

import dynamic from "next/dynamic";

const ExperienceEducation = dynamic(() => import("./ExperienceEducation"), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[520px] bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl animate-pulse" />
  ),
});

export default function ExperienceWrapper() {
  return <ExperienceEducation />;
}