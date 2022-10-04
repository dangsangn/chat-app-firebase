import React from "react";
import Conversation from "../components/Conversation";
import Sidebar from "../components/Sidebar";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="w-full flex justify-center items-center h-screen bg-blue-300 md:p-5">
      <div className="flex w-full md:w-11/12 lg:w-10/12 xl:w-3/4 h-screen md:h-5/6 md:rounded-2xl overflow-hidden bg-slate-100 shadow-xl">
        <div className="w-4/12 bg-purple-800 h-full">
          <Sidebar />
        </div>
        <div className="w-8/12 h-full">
          <Conversation />
        </div>
      </div>
    </div>
  );
};

export default Home;
