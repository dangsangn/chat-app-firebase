import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { useAuthContext } from "../context/auth/AuthContext";
import { db } from "../firebase";

type Props = {};

const Search = (props: Props) => {
  const {
    state: { userProfile },
  } = useAuthContext();
  const [resultUser, setResultUser] = useState<any>(null);
  const [keySearch, setKeySearch] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [isKeyDown, setIsKeyDown] = useState<boolean>(false); //TODO: handle show not found user when type input

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setError(false);
    setIsKeyDown(false);
    setKeySearch(value);
    if (!value) {
      setResultUser(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Enter" && keySearch) {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("displayName", "==", keySearch)
      );

      const querySnapshot = await getDocs(q);
      const querySnapshotObject = Object.assign({}, querySnapshot);
      if (!(querySnapshotObject as any)?._snapshot.docChanges.length) {
        setResultUser(null);
      } else {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.uid !== userProfile.uid) {
            setResultUser(data);
          }
        });
      }
      setIsKeyDown(true);
    } catch (error) {
      setError(true);
    }
  };

  const handleSelect = async () => {
    const combinedId =
      userProfile?.uid > resultUser?.uid
        ? userProfile.uid + resultUser.uid
        : resultUser.uid + userProfile.uid;
    try {
      const chat = await getDoc(doc(db, "chats", combinedId));
      if (!chat.exists()) {
        //create chat
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", userProfile.uid), {
          [combinedId + ".userInfo"]: {
            uid: resultUser.uid,
            displayName: resultUser.displayName,
            photoURL: resultUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", resultUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: userProfile.uid,
            displayName: userProfile.displayName,
            photoURL: userProfile.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
      setResultUser(null);
      setKeySearch("");
      setIsKeyDown(false);
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className="mb-4 border-b border-slate-300 border-solid">
      <input
        onKeyDown={handleKeyDown}
        value={keySearch}
        onChange={handleChangeInput}
        type="text"
        className=" bg-transparent w-full h-10  outline-none text-white px-4 placeholder:text-slate-50 "
        placeholder="Find a user"
      />
      {!resultUser && isKeyDown && (
        <p className="text-sm text-red-600 pl-2">Not found user</p>
      )}
      {resultUser && (
        <div className="flex items-center gap-3 p-4 hover:bg-purple-700 hover:cursor-pointer transition relative">
          <img
            src={resultUser?.photoURL}
            alt="avatar"
            className="rounded-full w-12 h-12 object-cover"
          />
          <p className="text-white font-semibold text-base">
            {resultUser?.displayName}
          </p>

          <button
            className="border-none outline-none absolute right-2 top-1/2 -translate-y-1/2 bg-white text-purple-700 px-2 rounded-lg"
            onClick={handleSelect}
          >
            Add
          </button>
        </div>
      )}
      {error && <p className="text-sm text-red-600 pl-2">Occur error</p>}
    </div>
  );
};

export default Search;
