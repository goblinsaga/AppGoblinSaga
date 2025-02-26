import SEHeader from "../src/components/SimpleEarnOneTest";
import SEHeader2 from "../src/components/SimpleEarnTwoTest";
import SEHeaderT from "../src/components/SimpleEarnOneTestTwo";
import SectionDivider from "../src/components/SectionDivider";
import Faq from "../src/components/Faq";
import Layout from "../src/layout/Layout";
import TokenSwap from "../src/components/TokenSwapGSA";

const DeFi = () => {
    return (
        <Layout pageTitle={"DeFi"}>
            <TokenSwap />
            {/* Section RoadMap */}
            <SectionDivider />
            {/* !Section RoadMap */}
            <SEHeader2 />
            {/* Section Divider */}
            <SectionDivider />
            {/* Section Divider */}
            <SEHeader />

            <SEHeaderT />

            <SectionDivider />

            <Faq />
        </Layout>
    );
};
export default DeFi;
