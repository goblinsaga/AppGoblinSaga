import SEHeader2Two from "../src/components/SimpleEarnTwoTestTwo";
import SEHeaderT from "../src/components/SimpleEarnOneTestTwo";
import SEHeaderH from "../src/components/SimpleEarnOneTestThree";
import SectionDivider from "../src/components/SectionDivider";
import Faq from "../src/components/Faq";
import Layout from "../src/layout/Layout";
import TokenSwap from "../src/components/TokenSwapGSA";
import TokenSwapWGSA from "../src/components/TokenSwapWGSA";

const DeFi = () => {
    return (
        <Layout pageTitle={"DeFi"}>
            <TokenSwap />
            {/* Section RoadMap */}
            <SectionDivider />
            {/* !Section RoadMap */}
            <SEHeader2Two />
            {/* Section Divider */}
            <SectionDivider />
            {/* Section Divider */}
            <SEHeaderT />
            <SEHeaderH />

            <SectionDivider />

            <TokenSwapWGSA />

            <SectionDivider />

            <Faq />
        </Layout>
    );
};
export default DeFi;
