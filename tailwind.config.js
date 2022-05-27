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
    plugins: [],
};
