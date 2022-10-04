import React from "react";
import { setChatCurrent } from "../context/chat/ChatAction";
import { useChatContext } from "../context/chat/ChatContext";

type Props = {
  user: any;
  chatId: string;
  lastMessage: string;
};

const Account = ({
  user: { displayName, photoURL, uid },
  lastMessage,
  chatId,
}: Props) => {
  const { dispatch } = useChatContext();
  const handleSelectUser = () => {
    dispatch(setChatCurrent({ chatId, displayName, photoURL, uid }));
  };

  return (
    <div
      className="flex items-center gap-3 p-4 hover:bg-purple-700 hover:cursor-pointer transition"
      onClick={handleSelectUser}
    >
      <img
        src={photoURL}
        alt="avatar"
        className="rounded-full w-12 h-12 object-cover"
      />
      <div className="">
        <p className="text-white font-semibold text-base">{displayName}</p>
        <p className="text-white font-semibold text-sm">{lastMessage}</p>
      </div>
    </div>
  );
};

export default Account;
