"use client";

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  HStack,
  ModalBody,
  ModalFooter,
  ModalHeader,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  SimpleGrid,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Card } from "@/components/Card";
import { useMutationSlice, useQuerySlice } from "@/store/api";
import { getUnreadWorksQuery, markWorkAsReadCall, Work } from "@/services/okami";
import { useAtomValue } from "jotai/react";
import { lowerCaseSearchInputAtom } from "@/store/searchInput";
import { SearchInput } from "@/components/Search";
import { filter, map } from "lodash";
import { Modal } from "@/components/Modal";

import React, { useState } from "react";
import { useModal } from "@/store/modal";
import { RefreshWorksStatusButton } from "@/components/RefreshWorksStatusButton";

interface MarkReadModalPayload {
  id: string;
  name: string;
  chapter: number;
}

function MarkReadModal() {
  const toast = useToast();
  const {
    modal: { payload, isOpen },
    closeModal,
  } = useModal<MarkReadModalPayload>("MarkReadModal");

  const [markAsRead, { isLoading }] = useMutationSlice(markWorkAsReadCall, getUnreadWorksQuery);

  const [input, setInput] = useState("");

  function handleMarkRead() {
    if (!payload) return;

    const value = Number(input);

    markAsRead({
      workId: payload.id,
      chapter: value,
    })
      .unwrap()
      .then(() => {
        toast({
          title: "Sucesso!",
          status: "success",
          description: `Capítulo ${value} de ${payload.name} marcado como lido`,
        });

        closeModal();
      })
      .catch(() => {
        toast({
          title: "Erro!",
          status: "error",
          description: `Não foi possível marcar o capítulo ${value} de ${payload.name} como lido`,
        });
      });
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalHeader>{payload?.name}</ModalHeader>
      <ModalBody>
        <NumberInput precision={1} defaultValue={payload?.chapter} onChange={setInput} min={1}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="gray" mr={3} onClick={closeModal} disabled={isLoading}>
          Fechar
        </Button>
        <Button
          isDisabled={!input}
          variant="solid"
          colorScheme="green"
          onClick={handleMarkRead}
          isLoading={isLoading}
        >
          Marcar como lido
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default function Page() {
  const { openModal } = useModal<MarkReadModalPayload>("MarkReadModal");

  const { currentData = [], isLoading } = useQuerySlice<Work[]>(getUnreadWorksQuery);
  const searchFilter = useAtomValue(lowerCaseSearchInputAtom);

  const workList = filter(
    map(currentData, (work) => ({
      title: work.name,
      id: work.id,
      type: work.category,
      nextChapterUpdatedAt: work.nextChapterUpdatedAt,
      img: work.imageUrl || "",
      chapter: work.chapter,
      url: work.url,
      nextChapter: work.nextChapter,
    })),
    ({ title }) => title.toLowerCase().includes(searchFilter),
  );

  function handleMarkRead(payload: { chapter: number; name: string; id: string }) {
    openModal(payload);
  }

  return (
    <>
      <Box mt="1">
        {isLoading && <Progress w="full" colorScheme="blue" size="xs" isIndeterminate />}
      </Box>

      <Container pt="10" maxW="full">
        <MarkReadModal />

        <VStack spacing="5">
          <HStack w="full" flex="1" justifyContent="center">
            <SearchInput />
            <RefreshWorksStatusButton />
          </HStack>

          <SimpleGrid columns={[1, 2, 3]} spacing={10} pb="5">
            {workList?.map((work) => (
              <Card key={work.id} data={work as any}>
                <ButtonGroup spacing="2">
                  <Button
                    fontSize={["sm", "md"]}
                    size={["sm", "md"]}
                    variant="solid"
                    colorScheme="blue"
                    onClick={() =>
                      handleMarkRead({
                        chapter: work.chapter,
                        name: work.title,
                        id: work.id,
                      })
                    }
                  >
                    Marcar
                  </Button>

                  <Button
                    variant="ghost"
                    colorScheme="blue"
                    href={work.url}
                    target="_blank"
                    as={"a"}
                    fontSize={["sm", "md"]}
                    size={["sm", "md"]}
                  >
                    Ir para o site
                  </Button>
                </ButtonGroup>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </>
  );
}
