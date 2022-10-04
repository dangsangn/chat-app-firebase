import { AuthActionKind } from "./AuthAction";
import { InitialValuesProps } from "./AuthContext";

interface AuthAction {
  type: AuthActionKind;
  payload: any;
}

export const authReducer = (state: InitialValuesProps, action: AuthAction) => {
  switch (action.type) {
    case AuthActionKind.ADD_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };

    default:
      return state;
  }
};
