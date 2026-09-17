'use client';

import React, { useState, useEffect } from "react";
import { Terminal as TerminalIcon, ExternalLink, Mail, GitBranch, Cpu, Database, Server, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TerminalWrapper from "./TerminalWrapper";
import { 
  NextJsIcon, ReactNativeIcon, TypeScriptIcon, TailwindIcon, ExpoIcon,
  NetIcon, CSharpIcon, PostgresIcon, RedisIcon, EfIcon, ApiIcon, AzureIcon,
  DockerIcon, LinuxIcon, GitIcon, CloudflareIcon, PostmanIcon 
} from "./TechIcons";

const frontendStack = [
  { name: "Next.js", icon: <NextJsIcon /> },
  { name: "React Native", icon: <ReactNativeIcon /> },
  { name: "TypeScript", icon: <TypeScriptIcon /> },
  { name: "Tailwind CSS", icon: <TailwindIcon /> },
  { name: "Expo", icon: <ExpoIcon /> },
];

const backendStack = [
  { name: ".NET 8", icon: <NetIcon /> },
  { name: "C#", icon: <CSharpIcon /> },
  { name: "PostgreSQL", icon: <PostgresIcon /> },
  { name: "Redis", icon: <RedisIcon /> },
  { name: "Entity Framework", icon: <EfIcon /> },
  { name: "REST APIs", icon: <ApiIcon /> }
];

const devopsStack = [
  { name: "Docker", icon: <DockerIcon /> },
  { name: "Linux", icon: <LinuxIcon /> },
  { name: "Git", icon: <GitIcon /> },
  { name: "Cloudflare", icon: <CloudflareIcon /> },
  { name: "Postman", icon: <PostmanIcon /> },
  { name: "Azure", icon: <AzureIcon /> }
];

const GLYPHS = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

export default function HeroSection() {
  const [selectedCategory, setSelectedCategory] = useState<{
    title: string;
    description: string;
    stack: { name: string; icon: React.ReactNode }[];
  } | null>(null);

  // Estados para animaciones de texto
  const [displayName, setDisplayName] = useState("");
  const [displayNick, setDisplayNick] = useState("(Tito)");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isNickResolved, setIsNickResolved] = useState(false);

  const fullName = "Manrique Carazo Nieto";
  const targetNick = "(Tito)";

  // 1. Efecto Typewriter pausado
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullName.length) {
        setDisplayName(fullName.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setIsTypingDone(true);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [fullName]);

  // 2. Efecto Scramble para (Tito)
  useEffect(() => {
    if (!isTypingDone) return;

    let iterations = 0;
    const maxIterations = 30;

    const interval = setInterval(() => {
      const scrambled = targetNick
        .split("")
        .map((char, i) => {
          if (char === "(" || char === ")") return char;
          if (i < iterations / 6) return targetNick[i];
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");

      setDisplayNick(scrambled);

      if (iterations >= maxIterations) {
        clearInterval(interval);
        setDisplayNick(targetNick);
        setIsNickResolved(true);
      }
      iterations++;
    }, 60);

    return () => clearInterval(interval);
  }, [isTypingDone, targetNick]);

  return (
    <section id="hero" className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-8 sm:p-12 flex flex-col gap-10 shadow-2xl font-sans relative overflow-hidden">
      
      {/* GRID SUPERIOR: 6 COLUMNAS PARA INFO, 6 PARA TERMINAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div className="lg:col-span-6 flex flex-col gap-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-mono w-fit">
            <TerminalIcon className="h-3.5 w-3.5 text-zinc-400" /> FULL-STACK DEVELOPER
          </div>

          {/* CONTENEDOR CON RESERVA DE ESPACIO PERFECTA (SIN LAYOUT SHIFT) */}
          <div className="relative min-h-[5rem] sm:min-h-[6rem] lg:min-h-[7rem] flex items-center">
            
            {/* Texto fantasma invisible que le indica al navegador el tamaño completo desde el inicio */}
            <h1 aria-hidden="true" className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight opacity-0 pointer-events-none select-none flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span>{fullName}</span>
              <span className="font-mono text-2xl sm:text-3xl font-normal">{targetNick}</span>
            </h1>

            {/* Texto visible animado posicionado de forma absoluta sobre el área reservada */}
            <h1 className="absolute inset-0 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-100 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span>
                {displayName}
                {!isTypingDone && <span className="animate-pulse text-emerald-500 font-mono ml-0.5">_</span>}
              </span>
              
              <span 
                className={`font-mono text-2xl sm:text-3xl font-normal transition-all duration-700 ${
                  !isTypingDone 
                    ? "opacity-0" 
                    : isNickResolved 
                    ? "opacity-100 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.85)]" 
                    : "opacity-100 text-zinc-500"
                }`}
              >
                {displayNick}
              </span>
            </h1>
          </div>
          
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl">
            Full-Stack Developer experienced in building and deploying scalable web, mobile, and backend applications. Specializing in robust server-side logic with <strong className="text-zinc-200 font-semibold">.NET 8, C#, and PostgreSQL</strong>, alongside modern frontend and mobile ecosystems including <strong className="text-zinc-200 font-semibold">Next.js, TypeScript, and React Native</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
            <a 
              href="#projects" 
              className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              ~/projects <ExternalLink className="h-3.5 w-3.5" />
            </a>
            
            <a 
              href="mailto:manri.carazo@gmail.com" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 px-4 py-2.5 rounded-lg transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-zinc-400" /> Contact
            </a>

            <a 
              href="https://github.com/TitoManri" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 px-4 py-2.5 rounded-lg transition-colors"
            >
              <GitBranch className="h-3.5 w-3.5 text-zinc-400" /> GitHub
            </a>
          </div>
        </div>

        {/* CONTENEDOR ESTABLE PARA LA TERMINAL */}
        <div className="lg:col-span-6 w-full h-[340px] relative flex items-center">
          <TerminalWrapper />
        </div>

      </div>

      {/* BOTTOM 3 COLUMNS STACK WITH ANIMATED MARQUEES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-800/80 font-mono">
        
        {/* Columna 1: Frontend & Mobile */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 flex flex-col gap-3 overflow-hidden relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-200 text-sm font-semibold">
              <Cpu className="h-4 w-4 text-zinc-400" />
              <span>Frontend & Mobile</span>
            </div>
            <button
              onClick={() => setSelectedCategory({
                title: "Frontend & Mobile",
                description: "Cross-platform mobile apps and responsive web interfaces.",
                stack: frontendStack
              })}
              className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:bg-zinc-800 transition-colors"
              title="Ver tecnologías en detalle"
              aria-label="Ver Frontend y Mobile en detalle"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans pr-8">
            Cross-platform mobile apps and responsive web interfaces.
          </p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] pt-2">
            <div className="animate-marquee flex gap-2">
              {[...frontendStack, ...frontendStack].map((item, i) => (
                <span key={`fe-${item.name}-${i}`} className="flex items-center gap-2 bg-zinc-950 border border-zinc-800/80 px-2.5 py-1.5 rounded text-zinc-300 text-[11px] whitespace-nowrap">
                  {item.icon}
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Columna 2: Core & Backend */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 flex flex-col gap-3 overflow-hidden relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-200 text-sm font-semibold">
              <Database className="h-4 w-4 text-zinc-400" />
              <span>Core & Backend</span>
            </div>
            <button
              onClick={() => setSelectedCategory({
                title: "Core & Backend",
                description: "Scalable APIs, clean architecture, and relational persistence.",
                stack: backendStack
              })}
              className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:bg-zinc-800 transition-colors"
              title="Ver tecnologías en detalle"
              aria-label="Ver Core y Backend en detalle"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans pr-8">
            Scalable APIs, clean architecture, and relational persistence.
          </p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] pt-2">
            <div className="animate-marquee flex gap-2">
              {[...backendStack, ...backendStack].map((item, i) => (
                <span key={`be-${item.name}-${i}`} className="flex items-center gap-2 bg-zinc-950 border border-zinc-800/80 px-2.5 py-1.5 rounded text-zinc-300 text-[11px] whitespace-nowrap">
                  {item.icon}
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Columna 3: Systems & DevOps */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 flex flex-col gap-3 overflow-hidden relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-200 text-sm font-semibold">
              <Server className="h-4 w-4 text-zinc-400" />
              <span>Systems & DevOps</span>
            </div>
            <button
              onClick={() => setSelectedCategory({
                title: "Systems & DevOps",
                description: "Containerization, Linux environment, and infrastructure tooling.",
                stack: devopsStack
              })}
              className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:bg-zinc-800 transition-colors"
              title="Ver tecnologías en detalle"
              aria-label="Ver Systems y DevOps en detalle"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans pr-8">
            Containerization, Linux environment, and infrastructure tooling.
          </p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] pt-2">
            <div className="animate-marquee flex gap-2">
              {[...devopsStack, ...devopsStack].map((item, i) => (
                <span key={`dev-${item.name}-${i}`} className="flex items-center gap-2 bg-zinc-950 border border-zinc-800/80 px-2.5 py-1.5 rounded text-zinc-300 text-[11px] whitespace-nowrap">
                  {item.icon}
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* MODAL CON ANIMACIÓN (FRAMER MOTION) */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedCategory(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="text-xl font-bold font-mono text-zinc-100">
                  {selectedCategory.title}
                </h3>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-zinc-400 hover:text-zinc-100 p-1 rounded-lg hover:bg-zinc-900 transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                {selectedCategory.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono">
                {selectedCategory.stack.map((item) => (
                  <div 
                    key={`modal-${item.name}`}
                    className="flex items-center gap-2.5 bg-zinc-900/80 border border-zinc-800 px-3 py-2.5 rounded-lg text-zinc-200 text-xs"
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 px-4 py-2 rounded-lg text-xs font-mono transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}