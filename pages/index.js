import { useLayoutEffect, useEffect, useRef, useCallback } from "react";
import SectionDivider from "../src/components/SectionDivider";
import Layout from "../src/layout/Layout";
import GoblinSection from "../src/components/GoblinSection";
import MinerStats from "../src/components/MinerStats";
import MinesSection from "../src/components/MinesSection";
import BoxsSection from "../src/components/BoxsSection";
import Faq from "../src/components/Faq";
import NewUsersTwo from "../src/components/NewUsers2";
import ZeusCenterApp from "../src/components/ZeusHelpBanner";

const Index = () => {
  const sectionRefs = useRef([]);
  
  const addSectionRef = useCallback((el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  }, []);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const currentRefs = sectionRefs.current;
    currentRefs.forEach((el) => observer.observe(el));

    return () => {
      currentRefs.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <Layout pageTitle={"Home"}>
      <div ref={addSectionRef} className="scroll-section">
        <div id="news">
          <NewUsersTwo />
        </div>
      </div>

      <div ref={addSectionRef} className="scroll-section">
        <ZeusCenterApp />
      </div>

      <div ref={addSectionRef} className="scroll-section">
        <MinerStats />
      </div>

      <div ref={addSectionRef} className="scroll-section">
        <SectionDivider />
      </div>

      <div ref={addSectionRef} className="scroll-section">
        <GoblinSection />
      </div>

      <div ref={addSectionRef} className="scroll-section">
        <SectionDivider />
      </div>

      <div ref={addSectionRef} className="scroll-section">
        <MinesSection />
      </div>

      <div ref={addSectionRef} className="scroll-section">
        <SectionDivider />
      </div>

      <div ref={addSectionRef} className="scroll-section">
        <BoxsSection />
      </div>

      <div ref={addSectionRef} className="scroll-section">
        <SectionDivider />
      </div>

      <div ref={addSectionRef} className="scroll-section">
        <Faq />
      </div>

      <style jsx global>{`
        /* Scroll Animation Styles */
        .scroll-section {
          opacity: 0;
          transform: translateY(40px);
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .scroll-section.section-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Add delay for each section */
        .scroll-section:nth-child(1) { transition-delay: 0.1s; }
        .scroll-section:nth-child(2) { transition-delay: 0.2s; }
        .scroll-section:nth-child(3) { transition-delay: 0.3s; }
        .scroll-section:nth-child(4) { transition-delay: 0.4s; }
        .scroll-section:nth-child(5) { transition-delay: 0.5s; }
        .scroll-section:nth-child(6) { transition-delay: 0.6s; }
        .scroll-section:nth-child(7) { transition-delay: 0.7s; }
        .scroll-section:nth-child(8) { transition-delay: 0.8s; }
        .scroll-section:nth-child(9) { transition-delay: 0.9s; }
      `}</style>
    </Layout>
  );
};

export default Index;
