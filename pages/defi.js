import SectionDivider from "../src/components/SectionDivider";
import Faq from "../src/components/Faq";
import Layout from "../src/layout/Layout";
import NewUsersThree from "../src/components/NewUsers3";
import TokenSwapWGSA from "../src/components/TokenSwapWGSA";
import StakeGSA from "../src/components/StakesGSA";

const DeFi = () => {
    return (
        <Layout pageTitle={"DeFi"}>
            <NewUsersThree />

            <TokenSwapWGSA />

            <StakeGSA />

            <SectionDivider />

            <Faq />
        </Layout>
    );
};
export default DeFi;
