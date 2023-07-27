import React from "react";
import {
  Modal as ChakraModal,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";

interface Props extends ModalProps {
  children: React.ReactNode;
}

export function Modal({ children, ...props }: Props) {
  return (
    <ChakraModal {...props}>
      <ModalOverlay />
      <ModalContent>{children}</ModalContent>
    </ChakraModal>
  );
}
