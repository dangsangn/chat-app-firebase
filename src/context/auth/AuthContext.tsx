import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useReducer } from "react";
import { auth } from "../../firebase";
import { getInfoUserProfile } from "./AuthAction";
import { authReducer } from "./AuthReducer";

export type InitialValuesProps = {
  userProfile: any;
};

const initialValues: InitialValuesProps = {
  userProfile: null,
};

const AuthContext = createContext<{
  state: InitialValuesProps;
  dispatch: React.Dispatch<any>;
}>({
  state: initialValues,
  dispatch: () => null,
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialValues);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          getInfoUserProfile({
            displayName: user?.displayName || "",
            email: user?.email || "",
            photoURL: user?.photoURL || "",
            uid: user?.uid,
          })
        );
      }
    });
    return () => {
      unSub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context) {
    return context;
  } else {
    throw new Error("auth context not available");
  }
};
export default AuthProvider;
