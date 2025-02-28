import SEHeader2 from "../src/components/SimpleEarnTwoTest";
import SEHeader2Two from "../src/components/SimpleEarnTwoTestTwo";
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
            <SEHeader2Two />
            {/* Section Divider */}
            <SectionDivider />
            {/* Section Divider */}
            <SEHeaderT />

            <SectionDivider />

            <Faq />
        </Layout>
    );
};
export default DeFi;
