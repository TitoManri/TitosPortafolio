"use client";

import React, { useState } from "react";
import { FolderGit2, ExternalLink, GitBranch, Cpu, Terminal, ShieldCheck, ChevronDown, ChevronUp, Image as ImageIcon, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectCard {
  id: string;
  title: string;
  type: "personal" | "commercial";
  period: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  badge: string;
  screenshots: string[];
}

const projectsList: ProjectCard[] = [
  {
    id: "doggiesdiet",
    title: "DoggiesDiet AI",
    type: "personal",
    period: "08/2025 - 08/2026",
    description: "Mobile application designed to generate pet nutrition reports and register food items through AI photograph analysis and computer vision, backed by a high-concurrency .NET 8 microservice and Redis caching.",
    techStack: ["React Native", "Expo", ".NET 8", "C#", "PostgreSQL", "Redis", "RevenueCat"],
    githubUrl: "https://github.com/TitoManri",
    badge: "AI & Mobile Ecosystem",
    screenshots: [
      "/images/projects/doggiesdiet-1.png",
      "/images/projects/doggiesdiet-2.png"
    ]
  },
  {
    id: "hikisa",
    title: "Carnes Hikisa Web Catalog",
    type: "commercial",
    period: "03/2026 - 06/2026",
    description: "Commercial web catalog application showcasing meat cuts with high-performance image optimization, category carousels, and fluid Framer Motion animations deployed on Cloudflare Pages.",
    techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "Cloudflare Pages"],
    githubUrl: "https://distribuidoracarneshikisa.com/",
    badge: "E-Commerce Web",
    screenshots: [
      "/images/projects/hikisa-1.png",
      "/images/projects/hikisa-2.png"
    ]
  },
  {
    id: "genesis",
    title: "Genesis Christian School Platform",
    type: "commercial",
    period: "07/2026 - 09/2026",
    description: "Comprehensive institutional web platform featuring virtual tours, interactive calendar modules, and relational database schemas managed via Drizzle ORM and PostgreSQL on Cloudflare Workers.",
    techStack: ["Next.js", "React", "Tailwind CSS", "Drizzle ORM", "PostgreSQL", "Cloudflare Workers"],
    githubUrl: "https://github.com/TitoManri",
    badge: "Enterprise Platform",
    screenshots: [
      "/images/projects/genesis-1.png",
      "/images/projects/genesis-2.png"
    ]
  }
];

export default function ProjectsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [personalIndex, setPersonalIndex] = useState(0);
  const [commercialIndex, setCommercialIndex] = useState(0);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const personalProjects = projectsList.filter(p => p.type === "personal");
  const commercialProjects = projectsList.filter(p => p.type === "commercial");
  
  const currentPersonal = personalProjects[personalIndex];
  const currentCommercial = commercialProjects[commercialIndex];

  return (
    <section id="projects" className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-8 sm:p-12 flex flex-col gap-12 shadow-2xl font-sans relative overflow-hidden">
      
      {/* HEADER DE LA SECCIÓN */}
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-mono w-fit">
          <FolderGit2 className="h-3.5 w-3.5 text-zinc-400" /> PORTFOLIO & REPOSITORIES
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
          Featured Projects
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl">
          Explore personal software ventures and commercial deployments using the numerical tabs and interactive screenshot galleries.
        </p>
      </div>

      {/* BLOQUE 1: PROYECTOS PERSONALES */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-mono text-sm">
          <div className="flex items-center gap-2 text-zinc-200">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold tracking-wide">~/personal-ventures</span>
          </div>

          {/* SELECTOR NUMÉRICO CON PILLS */}
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
            {personalProjects.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => {
                  setPersonalIndex(idx);
                  setExpandedId(null);
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  personalIndex === idx 
                    ? "bg-zinc-800 text-zinc-100 font-bold shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                title={proj.title}
              >
                [{idx + 1}] {proj.title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentPersonal.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 border border-zinc-800/80 rounded-xl p-6 sm:p-8 flex flex-col justify-between gap-6 hover:border-zinc-700 transition-all shadow-xl group"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-zinc-950 border border-zinc-800 text-emerald-400 text-xs font-mono px-2 py-0.5 rounded font-bold">
                      [{personalIndex + 1}]
                    </span>
                    <span className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-[11px] font-mono px-2.5 py-1 rounded">
                      {currentPersonal.badge}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-zinc-400" /> {currentPersonal.period}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                    {currentPersonal.title}
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    {currentPersonal.description}
                  </p>
                </div>
              </div>

              {/* CONTENEDOR DESPLEGABLE DE FOTOS / CAPTURAS PERSONALES */}
              <AnimatePresence>
                {expandedId === currentPersonal.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden flex flex-col gap-3 pt-4 border-t border-zinc-800/80"
                  >
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5" /> Gallery Preview:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentPersonal.screenshots.map((src, sIdx) => (
                        <div key={sIdx} className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex flex-col items-center justify-center p-2 min-h-[140px] relative">
                          <div className="absolute inset-0 bg-zinc-900/80 flex flex-col items-center justify-center gap-1 text-zinc-500 font-mono text-xs">
                            <ImageIcon className="h-6 w-6 text-zinc-600" />
                            <span>Screenshot {sIdx + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-4 pt-4 border-t border-zinc-800/80 mt-auto">
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs font-mono text-zinc-500 mr-2 flex items-center gap-1">
                    <Cpu className="h-3.5 w-3.5" /> Stack:
                  </span>
                  {currentPersonal.techStack.map((tech, tIdx) => (
                    <span 
                      key={tIdx}
                      className="bg-zinc-950 border border-zinc-800/80 px-2.5 py-0.5 rounded text-[11px] font-mono text-zinc-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => toggleExpand(currentPersonal.id)}
                    className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg"
                  >
                    <ImageIcon className="h-3.5 w-3.5" /> 
                    {expandedId === currentPersonal.id ? "Hide Photos" : "View Photos"} 
                    {expandedId === currentPersonal.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>

                  {currentPersonal.githubUrl && (
                    <a 
                      href={currentPersonal.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors"
                    >
                      <GitBranch className="h-3 w-3 text-emerald-400" /> Repository <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* BLOQUE 2: PROYECTOS COMERCIALES */}
      <div className="flex flex-col gap-5 pt-2">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-mono text-sm">
          <div className="flex items-center gap-2 text-zinc-200">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold tracking-wide">~/commercial-deployments</span>
          </div>

          {/* SELECTOR NUMÉRICO CON PILLS */}
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
            {commercialProjects.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => {
                  setCommercialIndex(idx);
                  setExpandedId(null);
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  commercialIndex === idx 
                    ? "bg-zinc-800 text-zinc-100 font-bold shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                title={proj.title}
              >
                [{idx + 1}] {proj.title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentCommercial.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-6 sm:p-8 flex flex-col justify-between gap-6 hover:border-zinc-700 transition-all group"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-zinc-950 border border-zinc-800 text-emerald-400 text-xs font-mono px-2 py-0.5 rounded font-bold">
                      [{commercialIndex + 1}]
                    </span>
                    <span className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-[11px] font-mono px-2.5 py-1 rounded">
                      {currentCommercial.badge}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-zinc-400" /> {currentCommercial.period}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                    {currentCommercial.title}
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    {currentCommercial.description}
                  </p>
                </div>
              </div>

              {/* CONTENEDOR DESPLEGABLE DE FOTOS / CAPTURAS COMERCIALES */}
              <AnimatePresence>
                {expandedId === currentCommercial.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden flex flex-col gap-3 pt-4 border-t border-zinc-800/80"
                  >
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5" /> Gallery Preview:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentCommercial.screenshots.map((src, sIdx) => (
                        <div key={sIdx} className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex flex-col items-center justify-center p-2 min-h-[140px] relative">
                          <div className="absolute inset-0 bg-zinc-900/80 flex flex-col items-center justify-center gap-1 text-zinc-500 font-mono text-xs">
                            <ImageIcon className="h-6 w-6 text-zinc-600" />
                            <span>Screenshot {sIdx + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-4 pt-4 border-t border-zinc-800/80 mt-auto">
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs font-mono text-zinc-500 mr-2 flex items-center gap-1">
                    <Cpu className="h-3.5 w-3.5" /> Stack:
                  </span>
                  {currentCommercial.techStack.map((tech, tIdx) => (
                    <span 
                      key={tIdx}
                      className="bg-zinc-950 border border-zinc-800/80 px-2 py-0.5 rounded text-[11px] font-mono text-zinc-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => toggleExpand(currentCommercial.id)}
                    className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg"
                  >
                    <ImageIcon className="h-3.5 w-3.5" /> 
                    {expandedId === currentCommercial.id ? "Hide Photos" : "View Photos"} 
                    {expandedId === currentCommercial.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>

                  {currentCommercial.githubUrl && (
                    <a 
                      href={currentCommercial.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors"
                    >
                      <GitBranch className="h-3 w-3 text-emerald-400" /> Visit <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
}