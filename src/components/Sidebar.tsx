import React from "react";
import Chats from "./Chats";
import Navbar from "./Navbar";
import Search from "./Search";

type Props = {};

const Sidebar = (props: Props) => {
  return (
    <div>
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;
