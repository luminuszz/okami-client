import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { useAtom } from "jotai/react";

interface Modal<Payload> {
  isOpen: boolean;
  payload?: Payload;
}

const defaultModalState: Modal<any> = {
  isOpen: false,
  payload: null,
};

type ModalStore = Record<string, Modal<any>>;

const modalStoreAtom = atom<ModalStore>({});

export const modalSliceAtom = atomFamily((id: string) =>
  atom(
    (get) => get(modalStoreAtom)[id] || defaultModalState,
    (get, set, modal: Partial<Modal<any>>) => {
      const currentModalState = get(modalStoreAtom)[id] || defaultModalState;

      const newModalState = { ...currentModalState, ...modal };

      set(modalStoreAtom, {
        ...get(modalStoreAtom),
        [id]: newModalState,
      });
    },
  ),
);

interface UseModalOutput<Payload> {
  openModal: (payload?: Payload) => void;
  closeModal: () => void;
  modal: Modal<Payload>;
}

export function useModal<Payload = null>(id: string): UseModalOutput<Payload> {
  const [modal, setModal] = useAtom(modalSliceAtom(id));

  const openModal = (payload?: Payload) => {
    setModal({ isOpen: true, payload });
  };

  const closeModal = () => setModal({ isOpen: false, payload: null });

  return {
    openModal,
    closeModal,
    modal,
  };
}
