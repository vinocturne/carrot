import type { NextPage } from "next";
import Item from "@components/item";
import Layout from "@components/layout";
import useSWR from "swr";
import { ProductWithCount } from "pages";
import ProductList from "@components/product-list";
import useUser from "@libs/client/useUser";

const Sold: NextPage = () => {
    const { user, isLoading } = useUser();
    return (
        <Layout title="판매내역" canGoBack seoTitle="Sold History">
            <div className="flex flex-col space-y-5 pb-10  divide-y">
                <ProductList kind="sales" />
            </div>
        </Layout>
    );
};

export default Sold;
