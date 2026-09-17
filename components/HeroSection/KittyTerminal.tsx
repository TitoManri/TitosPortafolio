"use client";

import React, { useState, useRef, useEffect } from "react";
import { CornerDownLeft, Maximize2, Minimize2, Terminal as TerminalIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HistoryItem {
  command: string;
  output: React.ReactNode;
}

const availableCommands = ["fastfetch", "neofetch", "help", "cat whoami.txt", "whoami", "stack", "clear", "sudo hire", "hire"];

const fastfetchOutput = (
  <div className="space-y-2 text-[10px] sm:text-[11px] font-mono py-1">
    {/* HARDWARE */}
    <div>
      <p className="text-[#ffb7c5]">┌──────────────────────Hardware──────────────────────┐</p>
      <p><span className="text-[#ffb7c5]">│ ├</span>: AMD Ryzen 7 9700X (16) @ 5.58 GHz</p>
      <p><span className="text-[#ffb7c5]">│ ├󰍛</span>: AMD Radeon RX 9060 XT [Discrete]</p>
      <p><span className="text-[#ffb7c5]">│ ├󰍛</span>: 13.44 GiB / 30.49 GiB (44%)</p>
      <p><span className="text-[#ffb7c5]">└ └</span>: 294.08 GiB / 931.01 GiB (32%) - btrfs</p>
      <p className="text-[#ffb7c5]">└────────────────────────────────────────────────────┘</p>
    </div>

    {/* SOFTWARE */}
    <div>
      <p className="text-[#89b4fa]">┌──────────────────────Software──────────────────────┐</p>
      <p><span className="text-[#89b4fa]"> OS</span>: CachyOS x86_64</p>
      <p><span className="text-[#89b4fa]">│ ├</span>: Linux cachyos</p>
      <p><span className="text-[#89b4fa]">└ └</span>: kitty 0.48.2</p>
      <p><span className="text-[#89b4fa]">└────────────────────────────────────────────────────┘</span></p>
    </div>
  </div>
);

export default function KittyTerminal() {
  const [inputVal, setInputVal] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: "fastfetch",
      output: fastfetchOutput
    }
  ]);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasMountedRef = useRef(false);

  // Auto-scroll SOLO dentro del contenedor de salida de la terminal.
  // Nunca se usa scrollIntoView porque eso arrastra la ventana del navegador
  // y reposiciona la página al recargar.
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const output = outputRef.current;
    if (!output) return;

    output.scrollTo({ top: output.scrollHeight, behavior: "smooth" });
  }, [history, isExpanded, isOpen]);

  // Enfoque automático al expandir o al abrir la terminal
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        // preventScroll evita que el navegador desplace la página hasta el input
        inputRef.current?.focus({ preventScroll: true });
      }, 100); // Pequeño retraso para asegurar que la animación termine de renderizarse
      return () => clearTimeout(timer);
    }
  }, [isExpanded, isOpen]);

  const matchingCommand = availableCommands.find((c) => c.startsWith(inputVal.trim().toLowerCase()) && inputVal.length > 0) || "";
  const suggestionGhost = matchingCommand.startsWith(inputVal.toLowerCase()) ? matchingCommand.slice(inputVal.length) : "";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" || (e.key === "ArrowRight" && suggestionGhost)) {
      e.preventDefault();
      const match = availableCommands.find((c) => c.startsWith(inputVal.trim().toLowerCase()));
      if (match) {
        setInputVal(match);
      }
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase().replace(/\s+/g, " ");
    if (!cmd) return;

    let outputNode: React.ReactNode = null;

    if (cmd === "help") {
      outputNode = (
        <div className="text-zinc-300 space-y-1">
          <p className="text-zinc-100 font-semibold">Available commands (Press Tab or Right Arrow to autocomplete):</p>
          <p><span className="text-zinc-200">fastfetch / neofetch</span> - Print system specs</p>
          <p><span className="text-zinc-200">cat whoami.txt</span> - Brief intro</p>
          <p><span className="text-zinc-200">stack</span> - Show core technologies</p>
          <p><span className="text-zinc-200">clear</span> - Clear terminal screen</p>
          <p><span className="text-zinc-200">sudo hire</span> - Priority application action</p>
        </div>
      );
    } else if (cmd === "neofetch" || cmd === "fastfetch") {
      outputNode = fastfetchOutput;
    } else if (cmd === "cat whoami.txt" || cmd === "whoami" || cmd === "cat whoami") {
      outputNode = (
        <p className="text-zinc-300">
          Full-Stack Developer focused on robust backend systems (.NET 8, C#, PostgreSQL) and modern frontend/mobile experiences (Next.js, React Native).
        </p>
      );
    } else if (cmd === "stack") {
      outputNode = (
        <p className="text-zinc-300">
          Core: .NET 8, C#, PostgreSQL, Redis, Next.js, TypeScript, React Native, Docker.
        </p>
      );
    } else if (cmd === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    } else if (cmd === "sudo hire" || cmd === "hire") {
      outputNode = (
        <p className="text-emerald-400 font-semibold">
          Access granted! Reach out directly at manri.carazo@gmail.com or via the contact section below.
        </p>
      );
    } else {
      outputNode = (
        <p className="text-red-400">
          zsh: command not found: {cmd}. Type <span className="text-zinc-200 underline">help</span> for available commands.
        </p>
      );
    }

    setHistory((prev) => [...prev, { command: inputVal, output: outputNode }]);
    setInputVal("");
  };

  return (
    <>
      {/* OVERLAY OSCURO ANIMADO */}
      <AnimatePresence>
        {isOpen && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-40"
          />
        )}
      </AnimatePresence>

      {/* CONTENEDOR CON LAYOUT ANIMATION PARA EXPANSIÓN FLUIDA */}
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className={`w-full ${isExpanded ? "fixed inset-x-4 top-[8vh] bottom-[8vh] max-w-4xl mx-auto z-50 h-[84vh]" : "h-[340px] w-full relative z-10"}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {!isOpen ? (
            /* ESTADO CERRADO */
            <motion.div
              key="reopen-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full bg-[#111217]/50 border border-dashed border-zinc-800 rounded-xl flex items-center justify-center"
            >
              <button
                onClick={() => {
                  setIsOpen(true);
                  setIsExpanded(false);
                }}
                className="flex items-center gap-2 bg-[#111217] hover:bg-[#181920] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-5 py-2.5 rounded-xl font-mono text-xs shadow-xl transition-all cursor-pointer group"
              >
                <TerminalIcon className="h-4 w-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span>Open kitty terminal ~ tito@cachyos</span>
              </button>
            </motion.div>
          ) : (
            /* ESTADO ABIERTO CON TRANSICIÓN CRT Y DE TAMAÑO */
            <motion.div
              key="terminal-window"
              initial={{ scaleY: 0.1, scaleX: 0.5, opacity: 0 }}
              animate={{ scaleY: 1, scaleX: 1, opacity: 1 }}
              exit={{ scaleY: 0.1, scaleX: 0.5, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              style={{ originX: "50%", originY: "50%" }}
              className="bg-[#111217] border border-zinc-800/90 rounded-xl overflow-hidden shadow-2xl font-mono text-xs flex flex-col w-full h-full shadow-[0_0_60px_rgba(0,0,0,0.9)] border-zinc-700/80"
            >
              <div className="bg-[#181920] px-4 py-2.5 border-b border-zinc-800/80 flex items-center justify-between text-zinc-400 select-none">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setIsOpen(false);
                      setIsExpanded(false);
                    }}
                    className="h-3 w-3 rounded-full bg-[#ff5f56] hover:opacity-85 transition-opacity focus:outline-none cursor-pointer"
                    title="Close terminal"
                  ></button>
                  <button 
                    onClick={() => setIsExpanded(false)}
                    className="h-3 w-3 rounded-full bg-[#ffbd2e] hover:opacity-85 transition-opacity focus:outline-none cursor-pointer"
                    title="Minimize terminal"
                  ></button>
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-3 w-3 rounded-full bg-[#27c93f] hover:opacity-85 transition-opacity focus:outline-none cursor-pointer"
                    title={isExpanded ? "Restore" : "Expand"}
                  ></button>
                </div>
                
                <div className="bg-[#111217] px-3 py-1 rounded text-zinc-300 border border-zinc-800 text-[11px] flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  kitty ~ tito@cachyos
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-zinc-500 hover:text-zinc-200 transition-colors p-1 cursor-pointer"
                    title={isExpanded ? "Minimize terminal" : "Maximize terminal"}
                  >
                    {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                  </button>
                  <span className="text-zinc-600 text-[10px]">zsh</span>
                </div>
              </div>

              <div ref={outputRef} className="p-3 flex-1 overflow-y-auto space-y-3 text-[11px] scrollbar-thin scrollbar-thumb-zinc-800">
                <div className="text-zinc-500">
                  Type <span className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded">fastfetch</span>. Press <span className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded">Tab</span> or <span className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded">→</span> to autocomplete.
                </div>

                {history.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <span className="text-emerald-400">❯</span>
                      <span className="text-zinc-200">{item.command}</span>
                    </div>
                    <div>{item.output}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleCommand} className="bg-[#14151a] border-t border-zinc-800/80 px-3 py-2 flex items-center gap-2 relative">
                <span className="text-emerald-400 z-10">❯</span>
                <div className="relative w-full flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="try 'fastfetch' or 'help'..."
                    className="bg-transparent border-none outline-none text-zinc-200 w-full font-mono text-xs placeholder:text-zinc-600 z-10 relative caret-emerald-400"
                  />
                  {suggestionGhost && (
                    <div className="absolute left-0 text-zinc-600 font-mono text-xs pointer-events-none select-none z-0">
                      <span className="invisible">{inputVal}</span>
                      <span>{suggestionGhost}</span>
                    </div>
                  )}
                </div>
                <button type="submit" className="text-zinc-600 hover:text-zinc-300 transition-colors z-10 cursor-pointer">
                  <CornerDownLeft className="h-3.5 w-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}