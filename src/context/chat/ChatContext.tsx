import React from "react";
import { createContext, useContext, useReducer } from "react";
import { chatReducer } from "./ChatReducer";

export type InitialValuesProps = {
  chatCurrent: any;
};

const initialValues: InitialValuesProps = {
  chatCurrent: null,
};

const ChatContext = createContext<{
  state: InitialValuesProps;
  dispatch: React.Dispatch<any>;
}>({
  state: initialValues,
  dispatch: () => null,
});

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, initialValues);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context) {
    return context;
  } else {
    throw new Error("chat context not available");
  }
};
export default ChatProvider;
