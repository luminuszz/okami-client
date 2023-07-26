import React from "react";
import {
  Modal as ChakraModal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai/react";
import { modalOpenAtom } from "@/store/modal";

interface Props {
  children: React.ReactNode;
}

export function Modal({ children }: Props) {
  const modalIsIsOpen = useAtomValue(modalOpenAtom);

  const [_, updateModal] = useAtom(modalOpenAtom);

  function handleClose() {
    updateModal(false);
  }

  return (
    <ChakraModal isOpen={modalIsIsOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>{children}</ModalContent>
    </ChakraModal>
  );
}
