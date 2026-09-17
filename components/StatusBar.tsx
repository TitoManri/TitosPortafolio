import React from "react";

export default function StatusBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#0a0a0a]/90 backdrop-blur-md px-4 sm:px-6 py-2.5 font-mono text-xs select-none">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        
        {/* LADO IZQUIERDO: Prompt / Usuario con indicador animado */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-zinc-200 font-bold tracking-tight truncate">
            tito@manrique-carazo
          </span>
          <span className="text-zinc-600 hidden xs:inline">/</span>
          <span className="text-zinc-400 hidden sm:inline">portfolio</span>
        </div>

        {/* LADO DERECHO: Enlaces de navegación con hover sobrio */}
        <nav className="flex items-center gap-3 sm:gap-6 text-zinc-400 shrink-0">
          <a 
            href="#projects" 
            className="px-2.5 py-1 rounded-lg hover:text-zinc-100 hover:bg-zinc-900/80 transition-all"
          >
            ~/projects
          </a>
          <a 
            href="mailto:manri.carazo@gmail.com" 
            className="px-2.5 py-1 rounded-lg hover:text-zinc-100 hover:bg-zinc-900/80 transition-all"
          >
            ~/contact
          </a>
        </nav>

      </div>
    </header>
  );
}