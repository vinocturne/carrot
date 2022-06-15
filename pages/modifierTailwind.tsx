import type { NextPage } from "next";

const Home: NextPage = () => {
    return (
        <div className="flex flex-col space-y-2 p-5">
            <ul className="list-disc marker:text-teal-500">
                <p className="first-letter:text-7xl first-letter:hover:text-purple-400">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem
                    molestiae optio corporis. Minus nemo maxime deleniti,
                    numquam aliquam quaerat laborum quam, reiciendis architecto
                    quos placeat sint, repellat tempora earum dicta.
                </p>
            </ul>
            {/* <ul className="list-disc marker:text-teal-500">
                <input
                    type="file"
                    className="file:cursor-pointer file:hover:text-purple-400 file:hover:bg-white file:hover:border-purple-400 file:hover:border-2 file:transition-colors file:border-0 file:rounded-xl file:px-5 file:text-white file:bg-purple-400"
                />
            </ul> */}
            {/* 이전에 자주 사용하던 태그인 details에서도 tailwind를 적용시킬 수 있음 */}
            {/* <details className="select-none open:text-white open:bg-indigo-400">
                <summary className="cursor-pointer">
                    What is my favorite food
                </summary>
                <span>ddack gal bi</span>
            </details> */}
        </div>
    );
};

export default Home;
