import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthContext } from "../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";

type Props = {};

const Navbar = (props: Props) => {
  const { state } = useAuthContext();
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  return (
    <div className="w-full h-16 flex align-center justify-between p-3 bg-purple-900">
      <span className="text-slate-100 font-bold text-2xl hidden md:hidden lg:block">
        Chat App
      </span>
      <div className="flex items-center gap-2 justify-between flex-1">
        <div className="flex items-center gap-2">
          <img
            src={state.userProfile?.photoURL}
            alt="avatar"
            className="rounded-full w-10 h-10 object-cover"
          />
          <span className="text-white font-bold">
            {state.userProfile?.displayName}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="border-none outline-none bg-purple-400 text-white px-3 py-1 rounded"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
