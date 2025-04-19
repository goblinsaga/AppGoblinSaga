import SectionDivider from "../src/components/SectionDivider";
import ZeusDonationApp from "../src/components/ZeusDonation";
import Faq from "../src/components/Faq";
import Layout from "../src/layout/Layout";

const Index = () => {
    return (
        <Layout pageTitle={"Home"}>

            <ZeusDonationApp />

            <SectionDivider />

            <Faq />

        </Layout>
    );
};
export default Index;
