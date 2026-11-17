import { getPortfolioContent } from "@/lib/content";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/sections/About";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";

export default async function HomePage() {
  const c = await getPortfolioContent();

  return (
    <>
      <Navbar name={c.profile.name} resumeUrl={c.resumeUrl} />
      <main>
        <Hero profile={c.profile} social={c.social} resumeUrl={c.resumeUrl} />
        <About profile={c.profile} />
        <Skills categories={c.skillCategories} />
        <Experience items={c.experiences} />
        <Education items={c.education} />
        <Projects projects={c.projects} />
        <Certifications items={c.certifications} />
        <Contact social={c.social} />
      </main>
      <Footer name={c.profile.name} social={c.social} />
    </>
  );
}
