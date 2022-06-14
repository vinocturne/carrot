import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
import { Product, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import client from "@libs/server/client";

interface ProductWithUser extends Product {
    user: User;
}
interface ItemDetailResponse {
    ok: boolean;
    product: ProductWithUser;
    relatedProducts: Product[];
    isLiked: boolean;
}

const ItemDetail: NextPage<ItemDetailResponse> = ({
    product,
    relatedProducts,
    isLiked,
}) => {
    const router = useRouter();
    const { mutate } = useSWRConfig();
    const pathname = router.pathname;
    const { user } = useUser({ pathname });
    //** Optimistic UI Update 낙관적으로 해당 행위가 이뤄질 것을 예상하여
    //** 변경작업을 빠르게 진행할 수 있도록 SWR을 활용하여 수정이 가능.
    //현재 화면에서의 데이터를 빠르게 변경하는 것을 Bound Mutation,
    //다른 화면에서의 데이터를 변경할 수 있게 하는 것을 Unbound Mutations이라고 함.
    //mutate()는 첫번째 인자로 변경될 데이터, 두번째 인자로 refetch 여부를 묻게된다.
    //액션이 생기면 첫번째 인자로 받은 데이터로 데이터를 바꾼 후 refetch여부에 따라 데이터를 불러와 재검증을 진행.
    const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
        router.query.id ? `/api/products/${router.query.id}` : null
    );
    const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
    const onFavClick = () => {
        if (!data) return;
        //prev를 통해 mutation이전의 데이터를 받아올 수 있다. 이는 unboundMutation에서 다른 컴포넌트의 데이터를 받아올 때도 사용 가능.
        boundMutate(
            (prev) => prev && { ...prev, isLiked: !data.isLiked },
            false
        );
        // toggleFav({});
        //unboundMutation에서는 다른 컴포넌트의 데이터를 가지고 있지 않으므로
        //prev를 활용하여 이전 데이터를 받아올 수 있도록 할 수 있음.
        //SWR은 현재 컴포넌트에서 유저 훅에 접근하여 해당 데이터를 조작할 수 있음.
        // mutate("/api/users/me")를 하게되면 단순 refetch만 진행.
        // mutate("/api/users/me", (prev: any) => ({ ok: !prev.ok }), false);
    };
    return (
        <Layout canGoBack seoTitle="Products Detail">
            <div className="px-4  py-4">
                <div className="mb-8">
                    <div className="relative pb-80">
                        <Image
                            alt="product"
                            layout="fill"
                            src={`https://imagedelivery.net/IfkIh2vCOXio26cf7UQYpw/${product.image}/public`}
                            className="h-96 bg-slate-300 object-cover"
                        />
                    </div>

                    <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
                        <Image
                            alt="avatar"
                            width={48}
                            height={48}
                            src={`https://imagedelivery.net/IfkIh2vCOXio26cf7UQYpw/${user?.avatar}/avatar`}
                            className="w-12 h-12 rounded-full bg-slate-300"
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                {product?.user?.name}
                            </p>
                            <Link href={`/users/profiles/${product?.user?.id}`}>
                                <a className="text-xs font-medium text-gray-500">
                                    View profile &rarr;
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-5">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {product?.name}
                        </h1>
                        <span className="text-2xl block mt-3 text-gray-900">
                            ${product?.price}
                        </span>
                        <p className=" my-6 text-gray-700">
                            {product?.description}
                        </p>
                        <div className="flex items-center justify-between space-x-2">
                            <Button large text="Talk to seller" />
                            <button
                                onClick={onFavClick}
                                className={cls(
                                    "p-3 rounded-md flex items-center justify-center hover:bg-gray-100 ",
                                    isLiked
                                        ? "text-red-400  hover:text-red-500"
                                        : "text-gray-400  hover:text-gray-500"
                                )}
                            >
                                {isLiked ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-6 w-6 "
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
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Similar items
                    </h2>
                    <div className=" mt-6 grid grid-cols-2 gap-4">
                        {relatedProducts?.map((product) => (
                            <Link
                                key={product?.id}
                                href={`/products/${product.id}`}
                            >
                                <a>
                                    <div className="h-56 w-full mb-4 bg-slate-300" />
                                    <h3 className="text-gray-700 -mb-1">
                                        {product?.name}
                                    </h3>
                                    <span className="text-sm font-medium text-gray-900">
                                        {product?.price}
                                    </span>
                                </a>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking",
        //getStaticPaths에서는 정적 페이지로 만들어놓을 대상의 paths를 지정해놓는데,
        //db에서 데이터를 불러와야하는 상품 페이지의 경우 전체 페이지를 다 만드는 것이 효율적이지 못하다.
        //이에 paths를 빈 상태로 보내고, 유저가 방문을 하게되었을 때
        //만약 그 페이지에 해당하는 html이 없다면, 유저를 잠시 기다리게하고 해당 페이지를 백그라운드에서 생성하여 넘겨준다.
        //첫번째 요청 이후 방문한 사람의 경우 이미 html이 존재하니 기다리지 않아도 된다.
    };
};

//getStaticProps를 사용할 때에는 어떤 것을 html로 만들것인지 확인해야하기 때문에 getStaticPaths가 필수가되는데,
//상품란의 경우 DB를통해 해당 데이터들을 받아오기 때문에 Blog 처럼 명확한 패스를 지정해줄 수 없음.
export const getStaticProps: GetStaticProps = async (ctx) => {
    if (!ctx?.params?.id) {
        return {
            props: {},
        };
    }
    const product = await client.product.findUnique({
        where: {
            id: +ctx.params.id.toString(),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });
    const terms = product?.name.split(" ").map((word) => ({
        name: {
            contains: word,
        },
    }));
    const relatedProducts = await client.product.findMany({
        where: {
            OR: terms,
            AND: {
                id: {
                    not: product?.id,
                },
            },
        },
    });
    const isLiked = false;
    // Boolean(
    //     await client.fav.findFirst({
    //         where: {
    //             productId: product?.id,
    //             userId: user?.id,
    //         },
    //         select: {
    //             id: true,
    //         },
    //     })
    // );
    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
            relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
            isLiked,
        },
    };
};

export default ItemDetail;
