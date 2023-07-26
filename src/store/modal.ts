import { atom } from "jotai";

export const modalOpenAtom = atom(false);

export const updateModalIsOpen = atom(null, (_, set, isOpen: boolean) => {
  set(modalOpenAtom, isOpen);
});

interface MarkReadModalPayload {
  id: string;
  name: string;
  chapter: number;
}

export const markReadModalPayloadAtom = atom<MarkReadModalPayload | null>(null);

export const openMarkReadModalAtomAction = atom(
  (get) => get(markReadModalPayloadAtom),
  (_, set, payload: MarkReadModalPayload) => {
    set(markReadModalPayloadAtom, payload);
    set(modalOpenAtom, true);
  },
);
