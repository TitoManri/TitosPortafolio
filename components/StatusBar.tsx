import React from "react";

export default function StatusBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#0a0c10]/90 backdrop-blur-md px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-4 font-mono text-zinc-400">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-teal-400 font-semibold">
          <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
          tito@manrique-carazo
        </span>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-300">portfolio</span>
      </div>
      
      <div className="hidden md:flex items-center gap-6 text-zinc-400">
        <span className="hover:text-zinc-200 cursor-pointer transition-colors">~/about</span>
        <span className="hover:text-zinc-200 cursor-pointer transition-colors">~/stack</span>
        <span className="hover:text-zinc-200 cursor-pointer transition-colors">~/projects</span>
        <span className="hover:text-zinc-200 cursor-pointer transition-colors">~/contact</span>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> 99.99% UP
        </span>
      </div>
    </header>
  );
}