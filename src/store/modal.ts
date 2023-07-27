import { atom } from "jotai";

export const modalOpenAtom = atom(false);

export const updateModalIsOpen = atom(null, (_, set, isOpen: boolean) => {
  set(modalOpenAtom, isOpen);
});

export interface MarkReadModalPayload {
  id: string;
  name: string;
  chapter: number;
}

export const markReadModalPayloadAtom = atom<any>(null);

export const openMarkReadModalAtomAction = atom(
  (get) => get(markReadModalPayloadAtom),
  (_, set, payload: MarkReadModalPayload) => {
    set(markReadModalPayloadAtom, payload);
    set(modalOpenAtom, true);
  },
);

export interface EditWorkModalPayload {
  id: string;
  name: string;
  chapter: number;
  url: string;
  imageUrl: string | null;
}

export const openEditWorkModalAction = atom(
  (get) => get(markReadModalPayloadAtom),
  (_, set, payload: EditWorkModalPayload | null) => {
    set(markReadModalPayloadAtom, payload);
    set(modalOpenAtom, true);
  },
);
