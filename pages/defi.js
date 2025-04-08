import { useRef, useLayoutEffect, useCallback } from "react";
import SectionDivider from "../src/components/SectionDivider";
import Faq from "../src/components/Faq";
import Layout from "../src/layout/Layout";
import NewUsersThree from "../src/components/NewUsers3";
import TokenSwapWGSA from "../src/components/TokenSwapWGSA";
import StakeGSA from "../src/components/StakesGSA";

const DeFi = () => {
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
        <Layout pageTitle={"DeFi"}>
            <div ref={addSectionRef} className="scroll-section">
                <NewUsersThree />
            </div>

            <div ref={addSectionRef} className="scroll-section">
                <TokenSwapWGSA />
            </div>

            <div ref={addSectionRef} className="scroll-section">
                <StakeGSA />
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
            `}</style>
        </Layout>
    );
};

export default DeFi;
