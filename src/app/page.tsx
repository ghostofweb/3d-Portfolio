import Header from "@/components/profile/Header";
import HighlightStrip from "@/components/profile/HighlightStrip";
import LinkRow from "@/components/profile/LinkRow";
import ExperienceSection from "@/components/profile/ExperienceSection";
import ProjectsSection from "@/components/profile/ProjectsSection";
import SkillsSection from "@/components/profile/SkillsSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl px-6 pb-24">
      <Header />
      <HighlightStrip />
      <LinkRow />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <Footer />
    </div>
  );
}
