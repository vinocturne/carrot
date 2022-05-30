//npx tailwindcss init -p로 tailwind.config와 postcss.config 파일 생성 가능
module.exports = {
    content: [
        //tailwind가 어디에서 사용될지를 설정
        //.{}을 통해 복수의 확장자들을 선택할 수 있음.
        "./pages/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {},
    },
    // darkMode: "class", //미디어쿼리를 사용하지 않고 클래스만으로 다크모드 구분. 버튼을 만들게 되면 해당 방법을 씀
    //보통은 html이나 body에 dark 클래스를 추가하면 하위 엘리멘트들도 모두 적용됨.
    darkMode: "media", // 기본 설정 미디어쿼리를 사용해 사용자 환경설정에 맞게 모드를 설정
    plugins: [require("@tailwindcss/forms")],
};
