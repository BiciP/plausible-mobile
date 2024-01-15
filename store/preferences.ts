import { WritableAtom } from "jotai";
import atomWithSecureStorage from "./secureAtom";

export interface Preferences {
  refreshTime?: number;
}

export const preferencesAtom: WritableAtom<Preferences, [Preferences], void> =
  atomWithSecureStorage("app.preferences", { refreshTime: 60 * 1000 });
