import React from "react";
import { Terminal, ExternalLink, Mail, GitBranch, Cpu, Database, Server } from "lucide-react";

const frontendStack = ["Next.js", "React Native", "TypeScript", "Tailwind CSS", "Expo", "i18next"];
const backendStack = [".NET 8", "C#", "PostgreSQL", "Redis", "Entity Framework", "REST APIs"];
const devopsStack = ["Docker", "Linux / CachyOS", "Git", "Cloudflare", "Coolify", "Postman"];

export default function HeroSection() {
  return (
    <section className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-8 sm:p-12 flex flex-col gap-8 shadow-2xl font-sans relative overflow-hidden">
      
      <div className="flex items-center justify-between bg-[#111111] border border-zinc-800/80 rounded-lg px-4 py-3 font-mono text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]"></span>
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]"></span>
            <span className="h-3 w-3 rounded-full bg-[#27c93f]"></span>
          </div>
          <div className="h-4 w-[1px] bg-zinc-800 mx-1"></div>
          <span className="text-zinc-200 font-medium">~/dev/whoami</span>
          <span className="hidden sm:inline text-zinc-600">--verbose --status=hireable</span>
        </div>
        
        <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono">
          <span className="bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800 text-zinc-300">session: tty1</span>
          <span className="hidden sm:inline">cachyos x86_64</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 max-w-4xl">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-mono w-fit">
          <Terminal className="h-3.5 w-3.5 text-zinc-400" /> FULL-STACK DEVELOPER
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-100 flex flex-wrap items-baseline gap-3">
          <span>Manrique Carazo Nieto</span> 
          <span className="text-zinc-500 font-mono text-2xl sm:text-3xl font-normal">(Tito)</span>
        </h1>
        
        <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-3xl">
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
            href="#contact" 
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 px-4 py-2.5 rounded-lg transition-colors"
          >
            <Mail className="h-3.5 w-3.5 text-zinc-400" /> Contact
          </a>

          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 px-4 py-2.5 rounded-lg transition-colors"
          >
            <GitBranch className="h-3.5 w-3.5 text-zinc-400" /> GitHub
          </a>

          <div className="flex items-center gap-2 bg-zinc-950/80 border border-zinc-800/80 px-3 py-2.5 rounded-lg text-zinc-300">
            <span className="text-zinc-300">manri.carazo@gmail.com</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-800/80 font-mono">
        
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 flex flex-col gap-3 overflow-hidden">
          <div className="flex items-center gap-2 text-zinc-200 text-sm font-semibold">
            <Cpu className="h-4 w-4 text-zinc-400" />
            <span>Frontend & Mobile</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Cross-platform mobile apps and responsive web interfaces.
          </p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] pt-2">
            <div className="animate-marquee flex gap-2">
              {[...frontendStack, ...frontendStack].map((tech, i) => (
                <span key={i} className="bg-zinc-950 border border-zinc-800/80 px-2.5 py-1 rounded text-zinc-300 text-[11px] whitespace-nowrap">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 flex flex-col gap-3 overflow-hidden">
          <div className="flex items-center gap-2 text-zinc-200 text-sm font-semibold">
            <Database className="h-4 w-4 text-zinc-400" />
            <span>Core & Backend</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Scalable APIs, clean architecture, and relational persistence.
          </p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] pt-2">
            <div className="animate-marquee flex gap-2">
              {[...backendStack, ...backendStack].map((tech, i) => (
                <span key={i} className="bg-zinc-950 border border-zinc-800/80 px-2.5 py-1 rounded text-zinc-300 text-[11px] whitespace-nowrap">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 flex flex-col gap-3 overflow-hidden">
          <div className="flex items-center gap-2 text-zinc-200 text-sm font-semibold">
            <Server className="h-4 w-4 text-zinc-400" />
            <span>Systems & DevOps</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Containerization, Linux environment, and infrastructure tooling.
          </p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] pt-2">
            <div className="animate-marquee flex gap-2">
              {[...devopsStack, ...devopsStack].map((tech, i) => (
                <span key={i} className="bg-zinc-950 border border-zinc-800/80 px-2.5 py-1 rounded text-zinc-300 text-[11px] whitespace-nowrap">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}