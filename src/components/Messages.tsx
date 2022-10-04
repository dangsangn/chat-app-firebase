import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { BiMessageRoundedX } from "react-icons/bi";
import { useAuthContext } from "../context/auth/AuthContext";
import { useChatContext } from "../context/chat/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

type Props = {};

const Messages = (props: Props) => {
  const [messages, setMessages] = useState<any>([]);

  const {
    state: { chatCurrent },
  } = useChatContext();
  const {
    state: { userProfile },
  } = useAuthContext();

  useEffect(() => {
    const getChats = async () => {
      onSnapshot(doc(db, "chats", chatCurrent.chatId), (doc) => {
        setMessages(doc.data()?.messages);
      });
    };
    chatCurrent && getChats();
  }, [chatCurrent]);

  return (
    <div className="p-4 overflow-y-scroll flex-1 bg-slate-200">
      {messages.length ? (
        messages.map((item: any, index: number) => (
          <Message
            key={index}
            owner={userProfile.uid === item.sender}
            data={item}
          />
        ))
      ) : (
        <div className="h-full flex items-center justify-center">
          <BiMessageRoundedX className="w-[30%] h-[30%] text-slate-400" />
        </div>
      )}
    </div>
  );
};

export default Messages;
