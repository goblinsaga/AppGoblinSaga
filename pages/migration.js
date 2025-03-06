import LiquidityManager from "../src/components/ManageLiquidity";
import LiquidityManagerTwo from "../src/components/ManageLiquidityWGSA";
import SectionDivider from "../src/components/SectionDivider";
import Layout from "../src/layout/Layout";

const Index = () => {
    return (
        <Layout pageTitle={"Home"}>

            <LiquidityManager />

            <SectionDivider />

            <LiquidityManagerTwo />

        </Layout>
    );
};
export default Index;
