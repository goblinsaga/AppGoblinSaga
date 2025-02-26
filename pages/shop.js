import ShopSections from "../src/components/ShopSections";
import Layout from "../src/layout/Layout";

const Shop = () => {
    return (
        <Layout pageTitle={"Shop"}>
            {/* !Section Divider */}
            {/* Section RoadMap */}
            <ShopSections />
            {/* !Section RoadMap */}
            {/* Section Divider */}
        </Layout>
    );
};
export default Shop;