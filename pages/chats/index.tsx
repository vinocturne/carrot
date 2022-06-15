import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Chat, Message, Product, User } from "@prisma/client";
import Image from "next/image";

interface ProductWithUser extends Product {
    user: User;
}

interface ChatWithInfo extends Chat {
    user: User;
    product: ProductWithUser;
    messages: Message[];
}

interface ChatResponse {
    ok: boolean;
    chats: ChatWithInfo[];
}

const Chats: NextPage = () => {
    const { pathname } = useRouter();
    const { user } = useUser({ pathname });
    const { data } = useSWR<ChatResponse>(`/api/chats`);
    console.log(data);
    return (
        <Layout hasTabBar title="채팅" seoTitle="Chats">
            <div className="divide-y-[1px] ">
                {data?.chats?.map((chat) => (
                    <Link href={`/chats/${chat.id}`} key={chat.id}>
                        <a className="flex px-4 cursor-pointer py-3 items-center space-x-3">
                            {user?.id === chat.userId ? (
                                chat.product.user.avatar ? (
                                    <div className="w-12 h-12 relative rounded-full overflow-hidden bg-slate-300">
                                        <Image
                                            alt="avatar"
                                            layout="fill"
                                            src={`https://imagedelivery.net/IfkIh2vCOXio26cf7UQYpw/${chat.product.user.avatar}/public`}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 relative rounded-full overflow-hidden bg-slate-300" />
                                )
                            ) : chat.user.avatar ? (
                                <div className="w-12 h-12 relative rounded-full overflow-hidden bg-slate-300">
                                    <Image
                                        alt="avatar"
                                        layout="fill"
                                        src={`https://imagedelivery.net/IfkIh2vCOXio26cf7UQYpw/${chat.user.avatar}/public`}
                                    />
                                </div>
                            ) : (
                                <div className="w-12 h-12 relative rounded-full overflow-hidden bg-slate-300" />
                            )}
                            <div>
                                <p className="text-gray-700">
                                    {user?.id === chat.userId
                                        ? chat.product.user.name
                                        : chat.user.name}
                                </p>
                                <p className="text-sm  text-gray-500">
                                    {chat.messages[
                                        chat.messages.length - 1
                                    ]?.message.slice(0, 70)}
                                </p>
                            </div>
                        </a>
                    </Link>
                ))}
            </div>
        </Layout>
    );
};

export default Chats;
