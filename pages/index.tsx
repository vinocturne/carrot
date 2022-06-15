import type { GetServerSideProps, NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import Head from "next/head";
import useSWR, { SWRConfig } from "swr";
import { Product } from "@prisma/client";
import Pagination from "react-js-pagination";
import { useState } from "react";
import client from "@libs/server/client";

export interface ProductWithCount extends Product {
    _count: {
        favs: number;
    };
}

interface ProductResponse {
    ok: boolean;
    total: number;
    products: ProductWithCount[];
}

const Home: NextPage = () => {
    // const Home: NextPage<{ products: ProductWithCount[]; total: number }> = ({
    //     products,
    //     total,
    // }) => {
    const { user, isLoading } = useUser();
    const [page, setPage] = useState(1);
    const { data } = useSWR<ProductResponse>(`/api/products?page=${page}`);
    const handlePageChange = (page: number) => {
        setPage(page);
    };
    console.log(data);
    return (
        <Layout title="홈" hasTabBar seoTitle="Home">
            <Head>
                <title>Home</title>?
            </Head>
            <div className="flex flex-col space-y-5 divide-y">
                {data?.products?.map((product) => (
                    <Item
                        id={product.id}
                        key={product.id}
                        title={product.name}
                        price={product.price}
                        hearts={product._count?.favs || 0}
                        image={product.image}
                    />
                ))}
                <FloatingButton href="/products/upload">
                    <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                </FloatingButton>
            </div>
            {data?.total ? (
                <div>
                    <Pagination
                        activePage={page}
                        itemsCountPerPage={10}
                        totalItemsCount={data?.total}
                        pageRangeDisplayed={5}
                        prevPageText="‹"
                        nextPageText="›"
                        onChange={handlePageChange}
                    />
                </div>
            ) : null}
        </Layout>
    );
};

// const Page: NextPage<{ products: ProductWithCount; total: number }> = ({
//     products,
//     total,
// }) => {
//     console.log(products);
//     return (
//         <SWRConfig
//             value={{
//                 fallback: {
//                     "/api/products": {
//                         ok: true,
//                         products,
//                         total,
//                     },
//                 },
//             }}
//         >
//             <Home />
//         </SWRConfig>
//     );
// };

//ssr은 데이터를 불러오는데 시간이 오래걸리면 화면의 호출 자체가 늦어진다.
//데이터가 작다면 빠르게 보여지겠지만, 데이터가 수십만개가되고, 그것을 한 번에 불러와야한다면 아예 반응이 없는 것처럼 보일 수 있음.
// export async function getServerSideProps() {
//     const total = await client.product.count();
//     const products = await client.product.findMany({});
//     return {
//         props: {
//             products: JSON.parse(JSON.stringify(products)),
//             total,
//         },
//     };
// }

export default Home;
