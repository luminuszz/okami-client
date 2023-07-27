"use client";

import { useMutationSlice, useQuerySlice } from "@/store/api";
import { getReadWorksQuery, updateWorkCall, Work } from "@/services/okami";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  FormLabel,
  Heading,
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
import { filter, map } from "lodash";
import React, { useEffect } from "react";
import { SearchInput } from "@/components/Search";
import { useAtom, useAtomValue } from "jotai/react";
import { lowerCaseSearchInputAtom } from "@/store/searchInput";
import { Modal } from "@/components/Modal";
import { Input } from "@chakra-ui/input";
import { openEditWorkModalAction, updateModalIsOpen } from "@/store/modal";
import { useForm } from "@/store/form";

interface WorkListProps {
  works: Work[];
}

function WorksList({ works }: WorkListProps) {
  const [, updateModal] = useAtom(openEditWorkModalAction);

  function handleOpenEditModal(work: Work) {
    updateModal({
      name: work.name,
      url: work.url,
      chapter: work.chapter,
      id: work.id,
    });
  }

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={10} pb="5">
      {map(works, (work) => (
        <Card
          data={{
            title: work.name,
            id: work.id,
            type: "MANGA",
            img: work.imageUrl || "",
            url: work.url,
            chapter: work.chapter,
          }}
        >
          <ButtonGroup spacing="2" fontSize={["sm", "md"]} size={["sm", "md"]}>
            <Button
              colorScheme="linkedin"
              onClick={() => handleOpenEditModal(work)}
            >
              Editar
            </Button>

            <Button colorScheme="yellow">Finalizar obra</Button>
          </ButtonGroup>
        </Card>
      ))}
    </SimpleGrid>
  );
}

function EditWorkModal() {
  const modalPayload = useAtomValue(openEditWorkModalAction);
  const toast = useToast();

  const [updateWork, { isLoading }] = useMutationSlice(
    updateWorkCall,
    getReadWorksQuery,
  );

  const [, updateModal] = useAtom(updateModalIsOpen);

  const { errors, values, setFieldValue, formMeta, handleSubmit } = useForm({
    defaultValues: modalPayload,
  });

  function editWork({ id, ...payload }: any) {
    updateWork({
      data: payload,
      id: modalPayload.id,
    })
      .unwrap()
      .then(() => {
        toast({
          title: "Obra atualizada com sucesso",
          status: "success",
        });

        updateModal(false);
      })
      .catch(() => {
        toast({
          title: "Erro ao atualizar obra",
          status: "error",
        });
      });
  }

  return (
    <Modal size="2xl">
      <ModalHeader>
        <Heading size="md">Editar </Heading>
      </ModalHeader>

      <ModalBody>
        <VStack spacing="4">
          <FormControl>
            <FormLabel>Nome</FormLabel>
            <Input
              type="text"
              value={values.name}
              onChange={(e) => setFieldValue("name", e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Url</FormLabel>
            <Input
              type="url"
              value={values.url}
              onChange={(e) => setFieldValue("url", e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Capitulo</FormLabel>
            <NumberInput
              value={values?.chapter?.toString()}
              precision={1}
              min={0}
              onChange={(value) => setFieldValue("chapter", Number(value))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </VStack>
      </ModalBody>

      <ModalFooter>
        <ButtonGroup spacing="4">
          <Button
            colorScheme="gray"
            onClick={() => updateModal(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSubmit(editWork)}
            isLoading={isLoading}
          >
            Salvar
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
}

export default function Page() {
  const { currentData = [], isLoading } =
    useQuerySlice<Work[]>(getReadWorksQuery);

  const searchFilter = useAtomValue(lowerCaseSearchInputAtom);

  const works = filter(currentData, ({ name }) =>
    name.toLowerCase().includes(searchFilter),
  );

  return (
    <>
      <EditWorkModal />

      <Box mt="1">
        {isLoading && (
          <Progress w="full" colorScheme="blue" size="xs" isIndeterminate />
        )}
      </Box>

      <Container pt="10" maxW="full">
        <VStack spacing={5}>
          <SearchInput />
          <WorksList works={works} />;
        </VStack>
      </Container>
    </>
  );
}
