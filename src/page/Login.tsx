import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
type Props = {};
type Inputs = {
  email: string;
  password: string;
};

const Login = (props: Props) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const email = data.email;
      const password = data.password;
      const result = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // dispatch(getInfoUserProfile(docSnap.data()));
        navigate("/");
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    } catch (error) {
      console.log("~ error", error);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen bg-blue-300 p-5">
      <div className="w-full md:w-4/12 py-3 px-6 flex justify-center items-center flex-col rounded-lg overflow-hidden bg-slate-50">
        <h2 className="text-3xl font-bold">Chat app</h2>
        <h3 className="text-sm mb-4 font-medium">Login</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
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
          <button
            type="submit"
            className="border-none outline-none w-full p-3 bg-blue-600 text-white rounded mt-3"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <span>You don't have account?</span>
            <Link className="text-blue-500 ml-1" to="/register">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
