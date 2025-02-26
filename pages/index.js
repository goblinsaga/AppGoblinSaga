import SectionDivider from "../src/components/SectionDivider";
import Layout from "../src/layout/Layout";
import GoblinSection from "../src/components/GoblinSection";
import MinerStats from "../src/components/MinerStats";
import MinesSection from "../src/components/MinesSection";
import BoxsSection from "../src/components/BoxsSection";
import Faq from "../src/components/Faq";

const Index = () => {
  return (
    <Layout pageTitle={"Home"}>
      <MinerStats />

      <SectionDivider />

      <GoblinSection />

      <SectionDivider />

      <MinesSection />

      <SectionDivider />

      <BoxsSection />

      <SectionDivider />

      <Faq />
    </Layout>
  );
};
export default Index;