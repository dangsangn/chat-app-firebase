import React from "react";
import moment from "moment";
import { useAuthContext } from "../context/auth/AuthContext";
import { useChatContext } from "../context/chat/ChatContext";
import { useEffect } from "react";
import { useRef } from "react";

type Props = {
  owner?: boolean;
  data: any;
};

const Message = ({ owner, data }: Props) => {
  const refMessage = useRef<any>(null);
  const {
    state: { userProfile },
  } = useAuthContext();
  const {
    state: { chatCurrent },
  } = useChatContext();
  const styleWrap = owner ? "flex-row-reverse" : "";
  const styleWrapMessage = owner ? "flex flex-col items-end" : "";
  const styleMessage = owner
    ? "rounded-tr-none bg-blue-400"
    : "rounded-tl-none bg-slate-400";
  const styleWrapAccount = owner ? "items-end" : "items-start";
  const time = Object.assign({}, data.date);

  useEffect(() => {
    refMessage.current &&
      refMessage.current?.scrollIntoView({
        behavior: "smooth",
      });
  }, [data]);

  return (
    <div
      className={"flex items-start gap-3 mb-5 " + styleWrap}
      ref={refMessage}
    >
      <div className={"w-[80px] flex flex-col shrink-0 " + styleWrapAccount}>
        <img
          src={owner ? userProfile?.photoURL : chatCurrent?.photoURL}
          alt="avatar"
          className="rounded-full w-12 h-12 object-cover mb-1"
        />
        <span className="text-slate-500 text-xs">
          {moment(new Date(time?.seconds * 1000)).fromNow()}
        </span>
      </div>
      <div className={styleWrapMessage}>
        {data?.text && (
          <span
            className={
              "inline-block text-white p-2 mb-3 rounded-md flex-1 break-normal break-all " +
              styleMessage
            }
          >
            {data?.text}
          </span>
        )}
        {data?.image?.length &&
          data?.image.map((image: string, index: number) => (
            <img
              key={index}
              src={image}
              alt="avatar"
              className=" w-6/12 h-6/12 object-cover m-b-1"
            />
          ))}
      </div>
    </div>
  );
};

export default Message;
