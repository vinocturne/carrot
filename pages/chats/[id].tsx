import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { useForm } from "react-hook-form";
import useMutaion from "@libs/client/useMutation";
import { useEffect } from "react";
import React from "react";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Chat } from "@prisma/client";

interface ChatForm {
    message: string;
}

interface ChatMessage {
    id: number;
    message: string;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
}

interface ChatWithMessages extends Chat {
    messages: ChatMessage[];
    user: {
        name: string;
        id: number;
    };
    product: {
        user: {
            name: string;
            id: number;
        };
    };
}

interface ChatResponse {
    ok: boolean;
    chat: ChatWithMessages;
}

const ChatDetail: NextPage = () => {
    // const {register, handleSubmit } = useForm<ChatForm>();
    // const [chat, {loading, data}] = useMutaion<ChatResponse>("/api/chats");
    // const onValid = (message:ChatForm) => {
    //     // if(loading) return;

    // }
    const router = useRouter();
    const { user, isLoading } = useUser();
    const { register, handleSubmit, reset } = useForm<ChatForm>();
    const { data, mutate } = useSWR<ChatResponse>(
        router.query.id ? `/api/chats/${router.query.id}` : null,
        {
            refreshInterval: 1000,
        }
    );
    useEffect(() => {
        if (data?.ok === false) {
            router.push("/chats");
        }
    }, [data, router]);
    const [sendMessage, { data: sendMessageData, loading }] = useMutation(
        `/api/chats/${router.query.id}`
    );
    const onValid = (form: ChatForm) => {
        if (loading) return;
        reset();
        mutate(
            (prev) =>
                prev &&
                ({
                    ...prev,
                    chat: {
                        ...prev.chat,
                        messages: [
                            ...prev.chat.messages,
                            {
                                id: Date.now(),
                                message: form.message,
                                user: { ...user },
                            },
                        ],
                    },
                } as any),
            false
        );
        sendMessage({ form, productId: data?.chat?.productId });
    };

    const chatBoxRef = React.createRef<HTMLDivElement>();

    useEffect(() => {
        (() => {
            if (chatBoxRef.current) {
                chatBoxRef.current.scrollTop =
                    chatBoxRef.current.scrollHeight + 100;
            }
        })();
    }, [data, chatBoxRef]);
    return (
        <Layout
            canGoBack
            title={
                user?.id === data?.chat.user.id
                    ? `${data?.chat.product.user.name}님과의 대화`
                    : `${data?.chat.user.name}님과의 대화`
            }
            seoTitle="Chat"
        >
            <div
                className="py-10 pb-32 h-[100vh] overflow-y-scroll px-4 space-y-4 scrollbar-hide"
                ref={chatBoxRef}
            >
                {data?.chat?.messages.map((message) => (
                    <Message
                        key={message.id}
                        message={message.message}
                        reversed={message.user?.id === user?.id}
                        avatarUrl={message.user?.avatar}
                    />
                ))}
            </div>
            <div className="fixed py-2 bg-white bottom-5 inset-x-0">
                <form
                    onSubmit={handleSubmit(onValid)}
                    className="fixed py-2 bg-white  bottom-0 inset-x-0"
                >
                    <div className="flex relative max-w-md items-center  w-full mx-auto">
                        <input
                            {...register("message", { required: true })}
                            type="text"
                            className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
                        />
                        <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                            <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                                &rarr;
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default ChatDetail;
