import type { NextPage } from "next";

const Home: NextPage = () => {
    return (
        <form className="flex flex-col space-y-2 p-5 ">
            <input
                type="text"
                required
                placeholder="Username"
                className="border p-1 peer border-gray-400 rounded "
            />
            <span className="hidden peer-invalid:block peer-invalid:text-red-500">
                This input is invalid
            </span>
            <span className="hidden peer-valid:block peer-valid:text-teal-500">
                Valid value
            </span>
            <span className="hidden peer-hover:block peer-focus:text-amber-500">
                hello
            </span>
            <input type="submit" value="Login" className="bg-white" />
        </form>
        // <form className="flex flex-col space-y-2 p-5 bg-blue-500 focus-within:bg-blue-400">
        //     <input
        //         type="text"
        //         required
        //         // disabled
        //         // required, disabled와 같은 설정에 따라 각 클래스의 스타일을 변경할 수 있음.
        //         placeholder="Username"
        //         className="required:bg-yellow-500 invalid:bg-red-500 valid:bg-teal-500 "
        //         // className="placeholder:text-red-500 "
        //         // className="placeholder-shown:bg-teal-500 "
        //         // className="invalid:bg-red-500 "
        //         // className="required:border-2 border-yellow-500 "
        //     />
        //     <span className="">This input is invalid</span>
        //     <span className="">Awesome username</span>
        //     <span className="">Hello</span>
        //     <input type="submit" value="Login" className="bg-white" />
        // </form>
    );
};

export default Home;
