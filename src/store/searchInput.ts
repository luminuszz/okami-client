import { atom } from "jotai";

export const searchInputAtom = atom("");

export const lowerCaseSearchInputAtom = atom((get) =>
  get(searchInputAtom).toLowerCase(),
);
