import { useRecoilValue } from "recoil";
import { authUserState } from "@/recoil/atom/auth/authUserAtom";

export const getUser = () => {
  const authUser = useRecoilValue(authUserState);
  return authUser;
};
