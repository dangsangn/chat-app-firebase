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
import { AiOutlineCloseCircle } from "react-icons/ai";

type Props = {};

const Input = (props: Props) => {
  const {
    state: { chatCurrent },
  } = useChatContext();
  const {
    state: { userProfile },
  } = useAuthContext();
  const [images, setImages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
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
              setImages((pre) => [...pre, String(downloadURL)]);
            });
          }
        );
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
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
    if (images.length) {
      message["image"] = images;
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
      setImages([]);
    } catch (error) {
      console.log("~ error", error);
    }
  };

  const handleRemoveImage = (image: string) => {
    setImages((pre) => {
      return pre.filter((item: string) => item !== image);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center px-4 py-2 gap-3">
      <div className="bg-white flex-1 p-3">
        <div className="flex items-center justify-start gap-3">
          {images.map((image: string) => (
            <div className="relative">
              <img
                src={image}
                alt="upload"
                className="mt-2 max-h-[100px] max-w-[100px] object-cover rounded-lg"
              />
              <AiOutlineCloseCircle
                className="absolute -top-1 -right-1 shadow-sm w-6 h-6 cursor-pointer"
                onClick={() => handleRemoveImage(image)}
              />
            </div>
          ))}
        </div>
        <textarea
          className="w-full rounded-lg  px-3 overflow-y-auto p-2 focus:outline-none"
          rows={1}
          onChange={handleChangeInput}
          value={input}
          onKeyDown={handleKeyDown}
        >
          {input}
        </textarea>
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
