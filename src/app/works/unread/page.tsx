"use client";

import {
  Button,
  Container,
  ModalBody,
  ModalFooter,
  ModalHeader,
  SimpleGrid,
  VStack,
  NumberInput,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputField,
  useToast,
  Progress,
  Box,
} from "@chakra-ui/react";
import { Card } from "@/components/Card";
import { useMutationSlice, useQuerySlice } from "@/store/okami";
import {
  getUnreadWorksQuery,
  markWorkAsReadCall,
  Work,
} from "@/services/okami";
import { useAtom, useAtomValue } from "jotai/react";
import { lowerCaseSearchInputAtom, searchInputAtom } from "@/store/searchInput";
import { SearchInput } from "@/components/Search";
import { filter, map } from "lodash";
import { Modal } from "@/components/Modal";
import { Input } from "@chakra-ui/input";
import { markReadModalPayloadAtom, modalOpenAtom } from "@/store/modal";
import React, { useCallback, useEffect, useState } from "react";

function MarkReadModal() {
  const toast = useToast();
  const payload = useAtomValue(markReadModalPayloadAtom);
  const [markAsRead, { isLoading }] = useMutationSlice(markWorkAsReadCall);

  const [, updateModal] = useAtom(modalOpenAtom);

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

        handleClose();
      })
      .catch(() => {
        toast({
          title: "Erro!",
          status: "error",
          description: `Não foi possível marcar o capítulo ${value} de ${payload.name} como lido`,
        });
      });
  }

  const handleClose = () => updateModal(false);

  return (
    <Modal>
      <ModalHeader>{payload?.name}</ModalHeader>
      <ModalBody>
        <NumberInput
          precision={1}
          defaultValue={payload?.chapter}
          onChange={(value) => setInput(value)}
          min={0}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </ModalBody>

      <ModalFooter>
        <Button
          colorScheme="gray"
          mr={3}
          onClick={handleClose}
          disabled={isLoading}
        >
          Fechar
        </Button>
        <Button
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
  const {
    currentData = [],
    refetch,
    isLoading,
  } = useQuerySlice<Work[]>(getUnreadWorksQuery);
  const searchFilter = useAtomValue(lowerCaseSearchInputAtom);

  const workList = filter(
    map(currentData, (work) => ({
      title: work.name,
      id: work.id,
      type: "MANGA",
      img: work.imageUrl || "",
      chapter: work.chapter,
      url: work.url,
    })),
    ({ title }) => title.toLowerCase().includes(searchFilter),
  );

  useEffect(() => {
    document.addEventListener("focus", () => {
      refetch();
    });

    return () => {
      document.removeEventListener("focus", () => console.log("remove"));
    };
  }, [refetch]);

  return (
    <>
      <Box mt="1">
        {isLoading && (
          <Progress w="full" colorScheme="blue" size="xs" isIndeterminate />
        )}
      </Box>

      <Container pt="10" maxW="container.xl">
        <MarkReadModal />

        <VStack spacing="5">
          <SearchInput />

          <SimpleGrid columns={3} spacing={10} pb="5">
            {workList?.map((work) => <Card key={work.id} data={work as any} />)}
          </SimpleGrid>
        </VStack>
      </Container>
    </>
  );
}
