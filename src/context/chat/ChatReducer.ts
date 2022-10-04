import { ChatActionKind } from "./ChatAction";
import { InitialValuesProps } from "./ChatContext";

interface AuthAction {
  type: ChatActionKind;
  payload: any;
}

export const chatReducer = (state: InitialValuesProps, action: AuthAction) => {
  switch (action.type) {
    case ChatActionKind.CHANGE_USER_CHAT:
      return {
        ...state,
        chatCurrent: action.payload,
      };

    default:
      return state;
  }
};
