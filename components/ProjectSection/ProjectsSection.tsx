"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FolderGit2, ExternalLink, GitBranch, Cpu, ChevronDown, ChevronUp, Image as ImageIcon, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projectsList } from "@/data/projectData"; 

export default function ProjectsSection() {
  const [personalIndex, setPersonalIndex] = useState(0);
  const [commercialIndex, setCommercialIndex] = useState(0);

  const [isPersonalExpanded, setIsPersonalExpanded] = useState(false);
  const [isCommercialExpanded, setIsCommercialExpanded] = useState(false);

  const personalProjects = projectsList.filter(p => p.type === "personal");
  const commercialProjects = projectsList.filter(p => p.type === "commercial");

  return (
    <section id="projects" className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-8 sm:p-12 flex flex-col gap-12 shadow-2xl font-sans relative overflow-hidden">
      
      {/* HEADER DE LA SECCIÓN */}
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono w-fit">
          <FolderGit2 className="h-3.5 w-3.5 text-zinc-400" /> PORTFOLIO & REPOSITORIES
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
          Featured Projects
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl">
          Explore personal software ventures and commercial deployments using numerical workspaces and interactive screenshot galleries.
        </p>
      </div>

      {/* BLOQUE 1: PROYECTOS PERSONALES */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-mono text-sm">
          <div className="flex items-center gap-2 text-zinc-100 font-semibold tracking-wide">
            <span className="text-zinc-500 font-normal">&gt;</span>
            <span>~/personal-ventures</span>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
            {personalProjects.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => setPersonalIndex(idx)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  personalIndex === idx 
                    ? "bg-zinc-100 text-zinc-950 font-bold shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                title={proj.title}
              >
                [{idx + 1}] {proj.title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* WORKSPACE SLIDER HORIZONTAL */}
        <div className="relative w-full overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/30">
          <motion.div
            animate={{ x: `-${personalIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="flex w-full items-start"
          >
            {personalProjects.map((proj, idx) => (
              <div 
                key={proj.id}
                className="w-full shrink-0 p-6 sm:p-8 flex flex-col justify-between gap-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/60 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-zinc-100 text-zinc-950 text-xs font-mono px-2 py-0.5 rounded font-bold">
                        [{idx + 1}]
                      </span>
                      <span className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-[11px] font-mono px-2.5 py-1 rounded">
                        {proj.badge}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-zinc-500" /> {proj.period}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-zinc-100">
                      {proj.title}
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                </div>

                {/* GALERÍA DE FOTOS DENTRO DEL WORKSPACE */}
                <AnimatePresence initial={false}>
                  {isPersonalExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden flex flex-col gap-3 pt-4 border-t border-zinc-800/80"
                    >
                      <span className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                        <ImageIcon className="h-3.5 w-3.5 text-zinc-400" /> Gallery Preview:
                      </span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {proj.screenshots.map((src, sIdx) => (
                          <div key={sIdx} className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex flex-col items-center justify-center p-2 relative group/img aspect-video">
                            <Image 
                              src={src} 
                              alt={`${proj.title} screenshot ${sIdx + 1}`}
                              fill
                              className="object-cover rounded transition-transform duration-300 group-hover/img:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-4 pt-4 border-t border-zinc-800/80 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs font-mono text-zinc-500 mr-2 flex items-center gap-1">
                      <Cpu className="h-3.5 w-3.5 text-zinc-500" /> Stack:
                    </span>
                    {proj.techStack.map((tech, tIdx) => (
                      <span 
                        key={tIdx}
                        className="bg-zinc-950 border border-zinc-800 px-2.5 py-0.5 rounded text-[11px] font-mono text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setIsPersonalExpanded(!isPersonalExpanded)}
                      className="flex items-center gap-1.5 text-xs font-mono text-zinc-200 hover:text-white transition-colors cursor-pointer bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-lg"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-zinc-400" /> 
                      {isPersonalExpanded ? "Hide Photos" : "View Photos"} 
                      {isPersonalExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>

                    {proj.githubUrl && (
                      <a 
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors"
                      >
                        <GitBranch className="h-3 w-3 text-zinc-400" /> Repository <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* BLOQUE 2: PROYECTOS COMERCIALES */}
      <div className="flex flex-col gap-5 pt-2">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-mono text-sm">
          <div className="flex items-center gap-2 text-zinc-100 font-semibold tracking-wide">
            <span className="text-zinc-500 font-normal">&gt;</span>
            <span>~/commercial-deployments</span>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
            {commercialProjects.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => setCommercialIndex(idx)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  commercialIndex === idx 
                    ? "bg-zinc-100 text-zinc-950 font-bold shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                title={proj.title}
              >
                [{idx + 1}] {proj.title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* WORKSPACE SLIDER HORIZONTAL */}
        <div className="relative w-full overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/30">
          <motion.div
            animate={{ x: `-${commercialIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="flex w-full items-start"
          >
            {commercialProjects.map((proj, idx) => (
              <div 
                key={proj.id}
                className="w-full shrink-0 p-6 sm:p-8 flex flex-col justify-between gap-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/60 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-zinc-100 text-zinc-950 text-xs font-mono px-2 py-0.5 rounded font-bold">
                        [{idx + 1}]
                      </span>
                      <span className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-[11px] font-mono px-2.5 py-1 rounded">
                        {proj.badge}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-zinc-500" /> {proj.period}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-zinc-100">
                      {proj.title}
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                </div>

                {/* GALERÍA DE FOTOS DENTRO DEL WORKSPACE */}
                <AnimatePresence initial={false}>
                  {isCommercialExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden flex flex-col gap-3 pt-4 border-t border-zinc-800/80"
                    >
                      <span className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                        <ImageIcon className="h-3.5 w-3.5 text-zinc-400" /> Gallery Preview:
                      </span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {proj.screenshots.map((src, sIdx) => (
                          <div key={sIdx} className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex flex-col items-center justify-center p-2 relative group/img aspect-video">
                            <Image 
                              src={src} 
                              alt={`${proj.title} screenshot ${sIdx + 1}`}
                              fill
                              className="object-cover rounded transition-transform duration-300 group-hover/img:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-4 pt-4 border-t border-zinc-800/80 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs font-mono text-zinc-500 mr-2 flex items-center gap-1">
                      <Cpu className="h-3.5 w-3.5 text-zinc-500" /> Stack:
                    </span>
                    {proj.techStack.map((tech, tIdx) => (
                      <span 
                        key={tIdx}
                        className="bg-zinc-950 border border-zinc-800 px-2.5 py-0.5 rounded text-[11px] font-mono text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setIsCommercialExpanded(!isCommercialExpanded)}
                      className="flex items-center gap-1.5 text-xs font-mono text-zinc-200 hover:text-white transition-colors cursor-pointer bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-lg"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-zinc-400" /> 
                      {isCommercialExpanded ? "Hide Photos" : "View Photos"} 
                      {isCommercialExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>

                    {proj.githubUrl && (
                      <a 
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors"
                      >
                        <GitBranch className="h-3 w-3 text-zinc-400" /> Visit <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  );
}