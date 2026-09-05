import ThemeToggle from "@/components/theme/ThemeToggle";
import Sidebar from "@/components/profile/Sidebar";
import Header from "@/components/profile/Header";
import ExperienceSection from "@/components/profile/ExperienceSection";
import ProjectsSection from "@/components/profile/ProjectsSection";
import SkillsSection from "@/components/profile/SkillsSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 pb-24 md:flex-row">
      <ThemeToggle />
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Header />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <Footer />
      </main>
    </div>
  );
}
