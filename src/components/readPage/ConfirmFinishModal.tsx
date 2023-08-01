import { Button, ButtonGroup, ModalBody, ModalFooter, ModalHeader, Text, useToast } from "@chakra-ui/react";
import { useMutationSlice } from "@/store/api";
import { getReadWorksQuery, markWorkAsFinishedCall } from "@/services/okami";
import { useModal } from "@/store/modal";
import { Modal } from "@/components/Modal";
import React from "react";

export interface ConfirmModalPayload {
  id: string;
  name: string;
}

export function ConfirmFinishWorkModal() {
  const toast = useToast();
  const [markWorkAsFinished, { isLoading }] = useMutationSlice(markWorkAsFinishedCall, getReadWorksQuery);

  const {
    modal: { isOpen, payload },
    closeModal,
  } = useModal<ConfirmModalPayload>("ConfirmFinishWorkModal");

  function handleFinishWork() {
    if (!payload) return;

    markWorkAsFinished(payload.id)
      .unwrap()
      .then(() => {
        toast({
          title: "Obra finalizada com sucesso",
          status: "success",
        });

        closeModal();
      })
      .catch(() => {
        toast({
          title: "Erro ao finalizar a obra",
          status: "error",
        });
      });
  }

  return (
    <Modal onClose={closeModal} isOpen={isOpen}>
      <ModalHeader>Finalizar a obra</ModalHeader>
      <ModalBody>
        <Text>
          Deseja mesmo finalizar a obra: <Text fontWeight="bold">{payload?.name} ?</Text>{" "}
        </Text>
      </ModalBody>

      <ModalFooter>
        <ButtonGroup spacing="3">
          <Button colorScheme="gray" onClick={closeModal}>
            Cancelar
          </Button>
          <Button colorScheme="yellow" onClick={handleFinishWork} isLoading={isLoading}>
            Finalizar
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
}
