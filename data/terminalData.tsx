import React from "react";
import TetrisGame from "@/components/games/TetrisGame";
import SnakeGame from "@/components/games/SnakeGame";

export interface TerminalCommand {
  name: string;
  output: React.ReactNode;
}

// Mapeo de proyectos con sus URLs
export const PROJECTS_MAP: Record<string, { name: string; description: string; url: string }> = {
  "carnes-hikisa": {
    name: "Carnes Hikisa",
    description: "Commercial web catalog built with Next.js, Tailwind CSS & Cloudflare",
    url: "https://distribuidoracarneshikisa.com/",
  },
};

export const FASTFETCH_OUTPUT = (
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
      <p className="text-[#89b4fa]">└────────────────────────────────────────────────────┘</p>
    </div>
  </div>
);

export const HELP_OUTPUT = (
  <div className="text-zinc-300 space-y-1">
    <p className="text-zinc-100 font-semibold">
      Available commands (Press Tab or Right Arrow to autocomplete):
    </p>
    <p><span className="text-zinc-200">fastfetch / neofetch</span> - Print system specs</p>
    <p><span className="text-zinc-200">cat whoami.txt</span> - Brief intro</p>
    <p><span className="text-zinc-200">stack</span> - Show core technologies</p>
    <p><span className="text-zinc-200">projects</span> - List viewable projects</p>
    <p><span className="text-zinc-200">open &lt;project&gt;</span> - Open project link in a new tab</p>
    <p><span className="text-zinc-200">tetris</span> - Play a quick game of Tetris</p>
    <p><span className="text-zinc-200">clear</span> - Clear terminal screen</p>
    <p><span className="text-zinc-200">sudo hire</span> - Priority application action</p>
  </div>
);

export const PROJECTS_OUTPUT = (
  <div className="text-zinc-300 space-y-2 py-1">
    <p className="text-zinc-100 font-semibold">
      Available projects (type <span className="text-emerald-400">open &lt;slug&gt;</span> to view):
    </p>
    <div className="space-y-1">
      {Object.entries(PROJECTS_MAP).map(([slug, proj]) => (
        <div key={slug} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <span className="text-emerald-400 font-bold min-w-[120px]">{slug}</span>
          <span className="text-zinc-400 text-[10px] sm:text-[11px]">- {proj.name}: {proj.description}</span>
        </div>
      ))}
    </div>
  </div>
);

export const WHOAMI_OUTPUT = (
  <p className="text-zinc-300">
    Full-Stack Developer focused on robust backend systems (.NET 8, C#, PostgreSQL) and modern frontend/mobile experiences (Next.js, React Native).
  </p>
);

export const STACK_OUTPUT = (
  <p className="text-zinc-300">
    Core: .NET 8, C#, PostgreSQL, Redis, Next.js, TypeScript, React Native, Docker.
  </p>
);

export const HIRE_OUTPUT = (
  <p className="text-emerald-400 font-semibold">
    Access granted! Reach out directly at manri.carazo@gmail.com or via the contact section below.
  </p>
);

export const availableCommands = [
  "fastfetch",
  "neofetch",
  "help",
  "cat whoami.txt",
  "whoami",
  "stack",
  "projects",
  "open",
  "tetris",
  ...Object.keys(PROJECTS_MAP).map((slug) => `open ${slug}`),
  "clear",
  "sudo hire",
  "hire",
];

export const getCommandOutput = (cmd: string): React.ReactNode | null => {
  const cleanCmd = cmd.trim().toLowerCase();

  if (cleanCmd === "help") return HELP_OUTPUT;
  if (cleanCmd === "neofetch" || cleanCmd === "fastfetch") return FASTFETCH_OUTPUT;
  if (cleanCmd === "cat whoami.txt" || cleanCmd === "whoami" || cleanCmd === "cat whoami") return WHOAMI_OUTPUT;
  if (cleanCmd === "stack") return STACK_OUTPUT;
  if (cleanCmd === "projects") return PROJECTS_OUTPUT;
  if (cleanCmd === "sudo hire" || cleanCmd === "hire") return HIRE_OUTPUT;
  if (cleanCmd === "tetris") return <TetrisGame />;
  if (cleanCmd === "snake") return <SnakeGame />;

  // Manejo de comandos 'open'
  if (cleanCmd.startsWith("open")) {
    const parts = cleanCmd.split(" ");
    const slug = parts[1];

    if (!slug) {
      return (
        <p className="text-amber-400">
          Usage: <span className="text-zinc-200">open &lt;project-name&gt;</span>. Type{" "}
          <span className="text-emerald-400 underline">projects</span> to list all available keys.
        </p>
      );
    }

    const project = PROJECTS_MAP[slug];
    if (project) {
      if (typeof window !== "undefined") {
        window.open(project.url, "_blank", "noopener,noreferrer");
      }
      return (
        <p className="text-emerald-400">
          Opening <span className="font-bold">{project.name}</span> in a new tab... (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-zinc-300 hover:text-white"
          >
            {project.url}
          </a>
          )
        </p>
      );
    }

    return (
      <p className="text-red-400">
        Project <span className="text-zinc-200 font-semibold">&apos;{slug}&apos;</span> not found. Type{" "}
        <span className="text-emerald-400 underline">projects</span> to view the list.
      </p>
    );
  }

  return (
    <p className="text-red-400">
      zsh: command not found: {cmd}. Type{" "}
      <span className="text-zinc-200 underline">help</span> for available commands.
    </p>
  );
};