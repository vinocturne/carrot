import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@components/floating-button";
import Layout from "@components/layout";
import useSWR from "swr";
import { Post, User } from "@prisma/client";
import useCoords from "@libs/client/useCoords";
import { useState } from "react";
import Pagination from "react-js-pagination";
import client from "@libs/server/client";
import useUser from "@libs/client/useUser";
interface PostWithUser extends Post {
    user: User;
    _count: {
        wonderings: number;
        answers: number;
    };
}

interface PostResponse {
    ok: boolean;
    total: number;
    posts: PostWithUser[];
}

const Community: NextPage<PostResponse> = () => {
    const { user, isLoading } = useUser();
    const { latitude, longitude } = useCoords();
    const [page, setPage] = useState(1);
    const { data } = useSWR<PostResponse>(
        latitude !== null && longitude !== null
            ? `/api/posts?page=${page}&latitude=${latitude}&longitude=${longitude}`
            : `/api/posts?page=${page}`
    );
    const handlePageChange = (page: number) => {
        setPage(page);
    };
    return (
        <Layout hasTabBar title="동네생활" seoTitle="Community">
            <div className="space-y-4 divide-y-[2px]">
                {data?.posts?.map((post) => (
                    <Link key={post.id} href={`/community/${post.id}`}>
                        <a className="flex cursor-pointer flex-col pt-4 items-start">
                            <span className="flex ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                동네질문
                            </span>
                            <div className="mt-2 px-4 text-gray-700">
                                <span className="text-orange-500 font-medium">
                                    Q.
                                </span>{" "}
                                {post.question}
                            </div>
                            <div className="mt-5 px-4 flex items-center justify-between w-full text-gray-500 font-medium text-xs">
                                <span>{post.user.name}</span>
                                <span>{String(post.createdAt)}</span>
                            </div>
                            <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t   w-full">
                                <span className="flex space-x-2 items-center text-sm">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    <span>
                                        궁금해요 {post._count?.wonderings}
                                    </span>
                                </span>
                                <span className="flex space-x-2 items-center text-sm">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        ></path>
                                    </svg>
                                    <span>답변 {post._count?.answers}</span>
                                </span>
                            </div>
                        </a>
                    </Link>
                ))}
                {data?.total ? (
                    <Pagination
                        activePage={page}
                        itemsCountPerPage={10}
                        totalItemsCount={data?.total}
                        pageRangeDisplayed={5}
                        prevPageText="‹"
                        nextPageText="›"
                        onChange={handlePageChange}
                    />
                ) : null}
                <FloatingButton href="/community/write">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        ></path>
                    </svg>
                </FloatingButton>
            </div>
        </Layout>
    );
};

//ISR(Incremental Static Regeneration)을 사용하면 SSR의 단점과 일반 리액트의 단점을 커버할 수 있음.
//서버사이드 렌더링은 데이터들이 한 번에 표시되는 대신 데이터가 크면 오래 기다려야하고
//api를 활용해 데이터를 불러오면 불러오기까지 로딩페이지를 보여주어야하지만
//ISR을 활용하면 로딩없이 바로 최신의 데이터를 표시할 수 있다.
// export async function getStaticProps() {
//     console.log("Building Community Statically");
//     const posts = await client.post.findMany({ include: { user: true } });
//     return {
//         props: {
//             posts: JSON.parse(JSON.stringify(posts)),
//         },
//         //getStaticProps는 빌드 시 한 번만 생성되지만, ISR을 사용하게 된다면 백그라운드에서 몇번이고 다시 실행 가능
//         //이를 활용해 일정 주기로 html을 계속 재생성해주면 유저는 로딩 없이 최신 데이터를 받아볼 수 있음.
//         //해당 기능을 정상적으로 테스트하기 위해서는 build 후 npm run start를 통해 프로덕트 모드로 실행해야 확인 가능하다.
//         // revalidate: 20,
//     };
// }

export default Community;
