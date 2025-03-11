import SectionDivider from "../src/components/SectionDivider";
import Faq from "../src/components/Faq";
import Layout from "../src/layout/Layout";
import TokenSwap from "../src/components/TokenSwapGSA";
import TokenSwapWGSA from "../src/components/TokenSwapWGSA";
import StakeGSA from "../src/components/StakesGSA";

const DeFi = () => {
    return (
        <Layout pageTitle={"DeFi"}>
            <TokenSwap />

            <SectionDivider />

            <TokenSwapWGSA />

            <StakeGSA />

            <SectionDivider />

            <Faq />
        </Layout>
    );
};
export default DeFi;
