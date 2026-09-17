import StatusBar from "@/components/StatusBar";
import HeroSection from "@/components/HeroSection/HeroSection";
import ExperienceWrapper from "@/components/Experience/ExperienceWrapper";
import ProjectsSection from "@/components/ProjectSection/ProjectsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] bg-tech-grid bg-terminal-glow text-zinc-300 font-sans selection:bg-zinc-800 selection:text-zinc-100 relative">
      <StatusBar />
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 flex flex-col gap-16 relative z-10">
        <HeroSection />
        <ExperienceWrapper />
        <ProjectsSection />
      </main>
    </div>
  );
}