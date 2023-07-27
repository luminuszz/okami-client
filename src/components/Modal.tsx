import React from "react";
import {
  Modal as ChakraModal,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai/react";
import { modalOpenAtom } from "@/store/modal";

interface Props extends Omit<ModalProps, "isOpen" | "onClose"> {
  children: React.ReactNode;
}

export function Modal({ children, ...props }: Props) {
  const modalIsIsOpen = useAtomValue(modalOpenAtom);

  const [_, updateModal] = useAtom(modalOpenAtom);

  function handleClose() {
    updateModal(false);
  }

  return (
    <ChakraModal {...props} isOpen={modalIsIsOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>{children}</ModalContent>
    </ChakraModal>
  );
}
