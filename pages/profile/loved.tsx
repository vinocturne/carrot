import type { NextPage } from "next";
import Item from "@components/item";
import Layout from "@components/layout";
import ProductList from "@components/product-list";
import useUser from "@libs/client/useUser";

const Loved: NextPage = () => {
    const { user, isLoading } = useUser();
    return (
        <Layout title="관심목록" canGoBack seoTitle="Wishlist">
            <div className="flex flex-col space-y-5 pb-10  divide-y">
                <ProductList kind="favs" />
            </div>
        </Layout>
    );
};

export default Loved;
