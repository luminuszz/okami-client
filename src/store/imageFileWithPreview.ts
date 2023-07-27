import { atom } from "jotai";

export const imageFileAtom = atom<File | null>(null);

export const imagePreviewAtom = atom("/image-preview-default.png");

export const imageCreatedByFileOrDefaultPreviewAtom = atom(
  (get) => {
    const file = get(imageFileAtom);

    return file ? URL.createObjectURL(file) : get(imagePreviewAtom);
  },
  (get, set, _: void) => {
    const currentImagePreview = get(imagePreviewAtom);

    URL.revokeObjectURL(currentImagePreview);

    set(imageFileAtom, null);
    set(imagePreviewAtom, "/image-preview-default.png");
  },
);
