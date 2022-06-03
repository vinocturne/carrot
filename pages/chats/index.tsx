import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";

const Chats: NextPage = () => {
    return (
        <Layout hasTabBar title="채팅">
            <div className="divide-y-[1px] ">
                {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
                    <Link href={`/chats/${i}`} key={i}>
                        <a className="flex px-4 cursor-pointer py-3 items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-slate-300" />
                            <div>
                                <p className="text-gray-700">Steve Jebs</p>
                                <p className="text-sm  text-gray-500">
                                    See you tomorrow in the corner at 2pm!
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