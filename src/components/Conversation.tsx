import React from "react";
import { BsFillCameraVideoFill, BsFillPersonPlusFill } from "react-icons/bs";
import { FiMoreHorizontal } from "react-icons/fi";
import { useChatContext } from "../context/chat/ChatContext";

import Input from "./Input";
import Messages from "./Messages";
type Props = {};

const Conversation = (props: Props) => {
  const {
    state: { chatCurrent },
  } = useChatContext();

  return chatCurrent ? (
    <div className="h-full flex justify-between flex-col">
      <div className="w-full h-16 bg-purple-700 flex items-center justify-between text-white px-3">
        <span className="font-bold text-lg">{chatCurrent?.displayName}</span>
        <div className="flex items-center gap-4">
          <BsFillCameraVideoFill className="w-6 h-6 cursor-pointer" />
          <BsFillPersonPlusFill className="w-6 h-6 cursor-pointer" />
          <FiMoreHorizontal className="w-6 h-6 cursor-pointer" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  ) : (
    <div className="h-full flex items-center justify-center">
      <span className="text-xl text-slate-600 font-bold ">Get chat now</span>
    </div>
  );
};

export default Conversation;
