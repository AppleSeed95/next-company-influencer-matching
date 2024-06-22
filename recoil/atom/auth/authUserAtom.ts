import { atom } from "recoil";

interface AuthUserState {
  user: {
    id?: number;
    name?: string;
    role?: string;
    email?: string;
    targetId?: number;
    targetStatus?: string;
    targetName?: string;
    responsibleName?: string;
    isFree?: number;
    active?: number;
    payment?: string;
  } | null;
}

export const authUserState = atom<AuthUserState>({
  key: "authUserState",
  default: {
    user: null,
  },
  dangerouslyAllowMutability: true,
});
