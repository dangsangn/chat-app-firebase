import React, { useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import {
  getDownloadURL,
  ref as refStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../firebase";
import { useChatContext } from "../context/chat/ChatContext";
import { v4 as uuid } from "uuid";
import { useAuthContext } from "../context/auth/AuthContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

type Props = {};

const Input = (props: Props) => {
  const {
    state: { chatCurrent },
  } = useChatContext();
  const {
    state: { userProfile },
  } = useAuthContext();
  const [image, setImage] = useState<string>("");
  const [input, setInput] = useState<string>("");
  console.log("~ input", input);
  const [, setLoadingImage] = useState<boolean>(false);

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const date = new Date();
        const storageRef = refStorage(storage, `images/${file.name + date}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case "paused":
                setLoadingImage(false);
                break;
              case "running":
                if (progress === 100) {
                  setLoadingImage(false);
                } else {
                  setLoadingImage(true);
                }
                break;
              default:
                setLoadingImage(false);
            }
          },
          (error) => {},
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImage(downloadURL);
            });
          }
        );
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleChangeInput = (e: any) => {
    setInput(e.currentTarget.textContent);
  };

  const handleSendMessage = async () => {
    const message: any = {
      id: uuid(),
      sender: userProfile.uid,
      date: Timestamp.now(),
    };
    if (input) {
      message["text"] = input;
    }
    if (image) {
      message["image"] = image;
    }

    try {
      await updateDoc(doc(db, "chats", chatCurrent.chatId), {
        messages: arrayUnion(message),
      });
      const messageLast = {
        [chatCurrent.chatId + ".lastMessage"]: input,
        [chatCurrent.chatId + ".date"]: serverTimestamp(),
      };
      await updateDoc(doc(db, "userChats", userProfile.uid), messageLast);
      await updateDoc(doc(db, "userChats", chatCurrent.uid), messageLast);
      setInput("");
      setImage("");
    } catch (error) {
      console.log("~ error", error);
    }
  };

  return (
    <div className="flex items-center px-4 py-2 gap-3">
      <div
        className="flex-1 border-[1px] border-solid border-slate-400 rounded-lg h-[100px] px-3 overflow-y-auto p-2"
        contentEditable="true"
        onInput={handleChangeInput}
      >
        {input}
        {image && (
          <img
            src={image}
            alt="upload"
            className="mt-2 max-h-[100px] object-cover"
          />
        )}
      </div>
      <label>
        <input type="file" className="hidden" onChange={handleUploadFile} />
        <BiImageAdd className="w-6 h-6 cursor-pointer" />
      </label>
      <button
        className="border-none outline-none px-3 py-2 h-10 bg-blue-600 text-white"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  );
};

export default Input;
