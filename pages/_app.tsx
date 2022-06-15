import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import useUser from "@libs/client/useUser";
import { useRouter } from "next/router";
import "./pagination.css";
import Script from "next/script";
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SWRConfig
            value={{
                fetcher: (url: string) =>
                    fetch(url).then((response) => response.json()),
            }}
        >
            <div className="w-full max-w-xl mx-auto">
                <Component {...pageProps} />
            </div>
            {/* 
            Script는 3가지 Strategy를 가짐
            - beforeInteractive : 페이지를 다 불러와서 상호작용하기 전에 스크립트를 불러오는 전략
            - afterInteractive : 기본 strategy. 리액트 앱 전체를 다 불러온 뒤에 스크립트를 호출
            - lazyOnload : 다른 모든 데이터나 소스들을 불러온 뒤 호출. 중요도가 가장 낮을 때 사용. 
            
            외부에서 스크립트를 호출할 때 호출시기를 정하고, onLoad를 통해 해당 스크립트를 불러온 뒤 행동 등을 지정 가능

            */}
            {/* <Script src="https://developers.kakao.com/sdk/js/kakao.js" strategy="lazyOnload" />
            <Script src="https://connect.facebook.net/en_US/sdk.js" onLoad={() => {
                window.fbAsyncInit = function() {
                    FB.init({
                        appId: "your-app-id",
                        autoLogAppEvents: true,
                        xfbml: true,
                        version: "v13.0",
                    })
                }
            }}/> */}
        </SWRConfig>
    );
}

export default MyApp;
