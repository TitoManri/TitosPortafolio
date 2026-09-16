import StatusBar from "@/components/StatusBar";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-zinc-300 font-sans selection:bg-zinc-800 selection:text-zinc-100">
      <StatusBar />
      <main className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col gap-16">
        <HeroSection />
      </main>
    </div>
  );
}