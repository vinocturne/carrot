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
    // const { user, isLoading } = useUser();
    const [page, setPage] = useState(1);
    const { data } = useSWR<ProductResponse>(`/api/products?page=${page}`);
    const handlePageChange = (page: number) => {
        setPage(page);
    };
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
                {data?.total ? (
                    <Pagination
                        activePage={page}
                        itemsCountPerPage={10}
                        totalItemsCount={data.total}
                        pageRangeDisplayed={5}
                        prevPageText="‹"
                        nextPageText="›"
                        onChange={handlePageChange}
                    />
                ) : null}
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
        </Layout>
    );
};

//SSR 사용 시 SWR사용이 되지 않기 때문에, Home 컴포넌트를 감싸주는 컴포넌트를 하나 더 만든 뒤, SWRConfig로 감싸준다.
//value에는 fallback을 지정할 수 있는데, 호출하려는 API 주소가 key가되어, 반환 값을 적어주면 정상적으로 받을 수 있다.
//다만 현재는 서버사이드에서 보내는 products에는 count가 포함되어져있지 않기 때문에 데이터만 우선적으로 받고,
//본래 Home 컴포넌트가 렌더링 되었을 때 api 호출을 통해 count를 포함한 정상적인 데이터 호출이 가능하다.
const Page: NextPage<{ products: ProductWithCount; total: number }> = ({
    products,
    total,
}) => {
    console.log(products);
    return (
        <SWRConfig
            value={{
                fallback: {
                    "/api/products": {
                        ok: true,
                        products,
                        total,
                    },
                },
            }}
        >
            <Home />
        </SWRConfig>
    );
};

//일반적으로는 서버단에서 api를 불러오면 SWR을 사용하지 않기 때문에 다른 탭에서 돌아올 때 캐시된 데이터를 사용할 수 없어진다.
export async function getServerSideProps() {
    const total = await client.product.count();
    const products = await client.product.findMany({});
    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
            total,
        },
    };
}

export default Page;
