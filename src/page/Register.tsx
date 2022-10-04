import React from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref as refStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FcAddImage } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
type Props = {};
type Inputs = {
  email: string;
  password: string;
  displayName: string;
  avatar: any;
};

const Register = (props: Props) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const avatarWatch = watch("avatar");
  const [error, setError] = useState<boolean>(false);
  const [imageAvatar, setImageAvatar] = useState<string>("");
  const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);

  useEffect(() => {
    if (avatarWatch && avatarWatch[0]) {
      const file = avatarWatch[0];
      try {
        const date = new Date();
        const storageRef = refStorage(storage, `images/${file?.name + date}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case "paused":
                setLoadingAvatar(false);
                break;
              case "running":
                if (progress === 100) {
                  setLoadingAvatar(false);
                } else {
                  setLoadingAvatar(true);
                }
                break;
              default:
                setLoadingAvatar(false);
            }
          },
          (error) => {
            console.log("error", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageAvatar(downloadURL);
            });
          }
        );
      } catch (e) {
        console.error(e);
      }
    }
  }, [avatarWatch]);

  useEffect(() => {
    const subscription = watch(() => setError(false));
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const email = data.email;
      const password = data.password;
      const displayName = data.displayName;
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = result.user.uid;
      if (imageAvatar && displayName && email) {
        //Update profile
        await updateProfile(result.user, {
          displayName,
          photoURL: imageAvatar,
        });
        //Update profile
        await setDoc(doc(db, "users", userId), {
          uid: userId,
          displayName,
          email,
          photoURL: imageAvatar,
        });
        //create empty user chats on firestore
        await setDoc(doc(db, "userChats", result.user.uid), {});

        navigate("/login");
      }
    } catch (error) {
      setError(true);
      console.log("~ error", error);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen bg-blue-300 p-5">
      <div className="w-full md:w-4/12 py-3 px-6 flex justify-center items-center flex-col rounded-lg overflow-hidden bg-slate-50">
        <h2 className="text-3xl font-bold">Chat app</h2>
        <h3 className="text-sm mb-4 font-medium">Register</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <input
            {...register("displayName", { required: true })}
            type="text"
            className="w-full h-12 outline-none border-b border-slate-400 border-solid bg-transparent mb-3"
            placeholder="Display name"
          />
          {errors.displayName && (
            <p className="mb-3 text-sm text-red-700">This field is required</p>
          )}
          <input
            {...register("email", { required: true })}
            type="email"
            className="w-full h-12 outline-none border-b border-slate-400 border-solid bg-transparent mb-3"
            placeholder="Email"
          />
          {errors.email && (
            <p className="mb-3 text-sm text-red-700">This field is required</p>
          )}
          <input
            {...register("password", { required: true })}
            type="password"
            className="w-full h-12 outline-none border-b border-slate-400 border-solid bg-transparent mb-3"
            placeholder="Password"
          />
          {errors.password && (
            <p className="mb-3 text-sm text-red-700">This field is required</p>
          )}
          <div className="flex items-center gap-2">
            <label className="flex items-center cursor-pointer">
              <FcAddImage className="w-10 h-10" />
              <span className="ml-1 text-gray-400">
                {imageAvatar ? "Change avatar" : "Add an avatar"}
              </span>
              <input
                type="file"
                className="hidden"
                {...register("avatar", { required: true })}
              />
            </label>
            {loadingAvatar ? (
              <strong>Loading...</strong>
            ) : (
              imageAvatar && (
                <img
                  src={imageAvatar}
                  alt="avatar"
                  className="w-[80px] h-[80px] object-cover rounded-md"
                />
              )
            )}
          </div>
          {errors.avatar && (
            <p className="mt-3 text-sm text-red-700">This field is required</p>
          )}
          <button className="border-none outline-none w-full p-3 bg-blue-600 text-white rounded mt-3">
            Sign up
          </button>
          <p className="mb-3 text-red-600 text-sm">
            {error && "Have an error!"}
          </p>
          <div className="text-center mt-4">
            <span>You do have account?</span>
            <Link className="text-blue-500 ml-1" to="/login">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
