import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuthContext } from "../context/auth/AuthContext";
import { db } from "../firebase";
import Account from "./Account";

type Props = {};

const Chats = (props: Props) => {
  const {
    state: { userProfile },
  } = useAuthContext();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userChats", userProfile.uid), (doc) => {
      if (doc.data()) {
        const data = Object.entries(Object.assign({}, doc.data()));
        setUsers(data);
      }
    });
    return () => {
      unSub();
    };
  }, [userProfile.uid]);

  return (
    <>
      {users
        .sort((a, b) => b[1].date - a[1].date)
        .map((user: any) => {
          return (
            <Account
              key={user[0]}
              chatId={user[0]}
              user={user[1]?.userInfo}
              lastMessage={user[1]?.lastMessage}
            />
          );
        })}
    </>
  );
};

export default Chats;
