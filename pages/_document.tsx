import Document, { Head, Html, Main, NextScript } from "next/document";

//앱 컴포넌트의 경우 모든 페이지에서 실행되지만 도큐먼트 컴포넌트는 서버에서 한 번만 실행.
//NextJS 내 html 뼈대를 세우는 역할

class CustomDocument extends Document {
    render(): JSX.Element {
        return (
            <Html lang="ko">
                <Head>
                    {/* nextJS의 폰트 최적화는 구글 폰트에서 이루어짐 */}
                    <link
                        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap"
                        rel="stylesheet"
                    />
                </Head>
                <body>
                    <Main />
                    {/* Main에서 앱 컴포넌트를 렌더링 */}
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default CustomDocument;
