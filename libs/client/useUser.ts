import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

// 매 번 호출을 실행할 컴포넌트마다 fetcher를 작성하는 것은 비효율적이니
// _app의 최상위에서 SWRConfig를 작성하여 하위의 모든 컴포넌트에서 일어나는 swr 사용에 대해
// default fetcher를 설정해두면 편하다.
// const fetcher = (url: string) => fetch(url).then((response) => response.json());

type PathProps = {
    pathname: string;
};

interface ProfileResponse {
    ok: boolean;
    profile: User;
}

export default function useUser({ pathname }: PathProps) {
    //SWR을 사용하면 useState, useEffect를 사용하지 않고도 데이터를 넘겨줄 수 있는데,
    //주목할 부분은 데이터 캐싱을 통해 이전 페이지로 돌아가게 되면 요청은 하되 캐싱된 데이터를 넘겨줌
    //또한 다른 탭에있다가 해당 페이지로 돌아오면 자동으로 refresh를 하며 데이터를 받아와
    //수정된 사항이 있다면 변경하여 표시하도록 함.

    // const [user, setUser] = useState();
    const router = useRouter();
    const isPublic = ["/enter"].includes(pathname);
    const { data, error } = useSWR<ProfileResponse>(
        isPublic ? null : "/api/users/me",
        (url: string) => fetch(url).then((res) => res.json())
    );
    // useEffect(() => {
    //     fetch("/api/users/me")
    //         .then((response) => response.json())
    //         .then((data) => {
    //             if (!data.ok) {
    //                 return router.replace("/enter");
    //             }
    //             setUser(data.profile);
    //         });
    // }, [router]);

    useEffect(() => {
        if (data && !data.ok) {
            router.replace("/enter");
        }
    }, [data, router]);

    return { user: data?.profile, isLoading: !data && !error };
}
