export enum AuthActionKind {
  ADD_USER_PROFILE = "ADD_USER_PROFILE",
}

export const getInfoUserProfile = (data: {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
}) => {
  return {
    type: AuthActionKind.ADD_USER_PROFILE,
    payload: data,
  };
};
