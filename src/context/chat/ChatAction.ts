export enum ChatActionKind {
  CHANGE_USER_CHAT = "CHANGE_USER_CHAT",
}

export const setChatCurrent = (data: any) => {
  return {
    type: ChatActionKind.CHANGE_USER_CHAT,
    payload: data,
  };
};
