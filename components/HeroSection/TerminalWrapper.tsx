"use client";

import dynamic from "next/dynamic";

const KittyTerminal = dynamic(() => import("./KittyTerminal"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[340px] bg-[#111217] border border-zinc-800/90 rounded-xl" />
  ),
});

export default function TerminalWrapper() {
  return <KittyTerminal />;
}