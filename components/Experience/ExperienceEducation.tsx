"use client";

import React, { useState } from "react";
import { Briefcase, Calendar, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { experiences, educations } from "@/data/experienceData"; 

export default function ExperienceEducation() {
  const [activeExpIndex, setActiveExpIndex] = useState(0);
  const [activeEduIndex, setActiveEduIndex] = useState(0);

  const currentExp = experiences[activeExpIndex];
  const currentEdu = educations[activeEduIndex];

  return (
    <section className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-8 sm:p-12 flex flex-col gap-12 shadow-2xl font-sans relative overflow-hidden">
      
      {/* HEADER DE LA SECCIÓN */}
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono w-fit">
          <Briefcase className="h-3.5 w-3.5 text-zinc-400" /> CAREER & ACADEMIA
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
          Experience & Education
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl">
          A track record of delivering professional software solutions, backend architectures, and enterprise systems.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* COLUMNA DE EXPERIENCIA LABORAL */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-mono text-sm">
            <div className="flex items-center gap-2 text-zinc-100 font-semibold tracking-wide">
              <span className="text-zinc-500 font-normal">&gt;</span>
              <span>~/employment</span>
            </div>
            
            {/* SELECTOR NUMÉRICO */}
            <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
              {experiences.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveExpIndex(idx)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                    activeExpIndex === idx 
                      ? "bg-zinc-100 text-zinc-950 font-bold shadow-sm" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  [{idx + 1}]
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeExpIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-6 sm:p-7 flex flex-col gap-5 relative group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/60 pb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-200">
                    <Calendar className="h-3 w-3 text-zinc-400" /> {currentExp.period}
                  </span>
                  <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-zinc-500" /> {currentExp.location}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-zinc-100">
                    {currentExp.role}
                  </h3>
                  <p className="text-sm font-mono text-zinc-400 pt-1 flex items-center gap-1.5">
                    <span className="text-zinc-600 font-bold">@</span> {currentExp.company}
                  </p>
                </div>

                {/* LISTA DE EXPERIENCIA */}
                <ul className="flex flex-col gap-3 text-xs sm:text-sm text-zinc-300 leading-relaxed border-l border-zinc-800/80 ml-2 pl-4">
                  {currentExp.description.map((desc, dIdx) => (
                    <li key={dIdx} className="relative before:content-[''] before:absolute before:-left-4 before:top-2.5 before:w-2.5 before:h-px before:bg-zinc-700">
                      {desc}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800/60">
                  {currentExp.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="bg-zinc-950 border border-zinc-800 px-2.5 py-0.5 rounded text-[11px] font-mono text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* COLUMNA DE EDUCACIÓN */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-mono text-sm">
            <div className="flex items-center gap-2 text-zinc-100 font-semibold tracking-wide">
              <span className="text-zinc-500 font-normal">&gt;</span>
              <span>~/education</span>
            </div>

            <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
              {educations.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveEduIndex(idx)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                    activeEduIndex === idx 
                      ? "bg-zinc-100 text-zinc-950 font-bold shadow-sm" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  [{idx + 1}]
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeEduIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-6 sm:p-7 flex flex-col gap-5 relative group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/60 pb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-200">
                    <Calendar className="h-3 w-3 text-zinc-400" /> {currentEdu.period}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    {currentEdu.location}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-zinc-100">
                    {currentEdu.degree}
                  </h3>
                  <p className="text-sm font-mono text-zinc-400 pt-1 flex items-center gap-1.5">
                    <span className="text-zinc-600 font-bold">@</span> {currentEdu.institution}
                  </p>
                </div>

                {/* LISTA DE EDUCACIÓN ACTUALIZADA */}
                <ul className="flex flex-col gap-3 text-xs sm:text-sm text-zinc-300 leading-relaxed border-l border-zinc-800/80 ml-2 pl-4">
                  {currentEdu.details.map((detail, dIdx) => (
                    <li key={dIdx} className="relative before:content-[''] before:absolute before:-left-4 before:top-2.5 before:w-2.5 before:h-px before:bg-zinc-700">
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

    </section>
  );
}