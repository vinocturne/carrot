import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";
import Link from "next/link";

interface Post {
    title: string;
    date: string;
    category: string;
    slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
    const { user, isLoading } = useUser();
    return (
        <Layout title="Blog" seoTitle="Blog">
            <h1 className="font-semibold text-lg text-center mt-5 mb-10">
                Latest Post
            </h1>
            {posts.map((post, index) => (
                <div key={index} className="mb-5">
                    <Link href={`/blog/${post.slug}`}>
                        <a>
                            <span className="text-lg text-red-500">
                                {post.title}
                            </span>
                            <div>
                                <span>
                                    {post.date}/{post.category}
                                </span>
                            </div>
                        </a>
                    </Link>
                </div>
            ))}
        </Layout>
    );
};

//getStaticProps는 html 정적파일을 생성
export async function getStaticProps() {
    const blogPosts = readdirSync("./posts/").map((file) => {
        const content = readFileSync(`./posts/${file}`, "utf-8");
        const [slug, _] = file.split(".");
        return { ...matter(content).data, slug };
    });
    console.log(blogPosts);
    return {
        props: {
            posts: blogPosts,
        },
    };
}

export default Blog;
