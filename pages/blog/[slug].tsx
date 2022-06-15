import Layout from "@components/layout";
import { readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps, NextPage } from "next";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";

const Post: NextPage<{ post: string; data: any }> = ({ post, data }) => {
    return (
        <Layout canGoBack seoTitle={data.title} title={data.title}>
            <div
                className="blog-post-content"
                dangerouslySetInnerHTML={{ __html: post }}
            />
        </Layout>
    );
};

//동적 url을 가진 컴포넌트에서 static 페이지를 html로 빌드할 때에는
//얼마나 많은 페이지를 빌드할지 명시하여야 함
//이를 위해 path를 지정해주는데, 이 때 getStaticPaths()를 사용
export function getStaticPaths() {
    return {
        paths: [],
        fallback: "blocking",
    };
}
//즉 동적 url을 사용하면서 getStaticProps를 사용하기 위해서는 getStaticPaths를 사용해야함
export const getStaticProps: GetStaticProps = async (ctx) => {
    const { content, data } = matter.read(`./posts/${ctx.params?.slug}.md`);
    //md 파일을 html로 변환하기 위해 unified, remark-parse, remark-html 라이브러리가 필요
    const { value } = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(content);

    return {
        props: {
            data,
            post: value,
        },
    };
};

export default Post;
