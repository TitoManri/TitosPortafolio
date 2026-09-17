import React from "react";

export default function StatusBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#0a0a0a]/90 backdrop-blur-md px-6 py-2.5 text-xs grid grid-cols-3 items-center font-mono text-zinc-400">
      
      <div className="flex items-center gap-3 justify-start">
        <span className="flex items-center gap-1.5 text-zinc-300 font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          tito@manrique-carazo
        </span>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-300">portfolio</span>
      </div>
      
      <div className="hidden md:flex items-center justify-center gap-6 text-zinc-400">
        <a href="#projects" className="hover:text-zinc-200 transition-colors">~/projects</a>
        <a href="mailto:manri.carazo@gmail.com" className="hover:text-zinc-200 transition-colors">~/contact</a>
      </div>
      
      <div className="flex items-center gap-3 justify-end">
        <span className="flex items-center gap-1.5 text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> 99.99% UP
        </span>
      </div>

    </header>
  );
}