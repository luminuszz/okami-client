"use client";

import { useMutationSlice, useQuerySlice } from "@/store/api";
import {
  getReadWorksQuery,
  markWorkAsFinishedCall,
  updateWorkCall,
  uploadWorkImageCall,
  Work,
} from "@/services/okami";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
  SimpleGrid,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Card } from "@/components/Card";
import { filter, map } from "lodash";
import React from "react";
import { SearchInput } from "@/components/Search";
import { useAtomValue } from "jotai/react";
import { lowerCaseSearchInputAtom } from "@/store/searchInput";
import { Modal } from "@/components/Modal";
import { Input } from "@chakra-ui/input";
import { useModal } from "@/store/modal";
import { useForm } from "react-hook-form";
import { ImageFileWithPreview } from "@/components/ImageFileWithPreview";
import { imageFileAtom } from "@/store/imageFileWithPreview";

interface WorkListProps {
  works: Work[];
}

interface ConfirmModalPayload {
  id: string;
  name: string;
}

function ConfirmFinishWorkModal() {
  const toast = useToast();
  const [markWorkAsFinished, { isLoading }] = useMutationSlice(
    markWorkAsFinishedCall,
    getReadWorksQuery,
  );

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
          Deseja mesmo finalizar a obra:{" "}
          <Text fontWeight="bold">{payload?.name} ?</Text>{" "}
        </Text>
      </ModalBody>

      <ModalFooter>
        <ButtonGroup spacing="3">
          <Button colorScheme="gray" onClick={closeModal}>
            Cancelar
          </Button>
          <Button
            colorScheme="yellow"
            onClick={handleFinishWork}
            isLoading={isLoading}
          >
            Finalizar
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
}

function WorksList({ works }: WorkListProps) {
  const { openModal: openEditModal } =
    useModal<EditWorkModalPayload>("EditWorkModal");
  const { openModal: openConfirmModal } = useModal<ConfirmModalPayload>(
    "ConfirmFinishWorkModal",
  );

  function handleOpenEditModal(work: Work) {
    openEditModal({
      name: work.name,
      url: work.url,
      chapter: work.chapter,
      id: work.id,
      imageUrl: work.imageUrl,
    });
  }

  function handleOpenConfirmModal(id: string, name: string) {
    openConfirmModal({
      id,
      name,
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
              variant={work.isFinished ? "ghost" : "solid"}
              isDisabled={work.isFinished}
              colorScheme={work.isFinished ? "green" : "yellow"}
              onClick={() => handleOpenConfirmModal(work.id, work.name)}
            >
              {work.isFinished ? "Finalizada" : "Finalizar"}
            </Button>

            <Button
              colorScheme="linkedin"
              onClick={() => handleOpenEditModal(work)}
            >
              Editar
            </Button>
          </ButtonGroup>
        </Card>
      ))}
    </SimpleGrid>
  );
}

interface EditWorkModalPayload {
  name: string;
  id: string;
  chapter: number;
  imageUrl: string | null;
  url: string;
}

function EditWorkModal() {
  const toast = useToast();
  const {
    modal: { payload, isOpen },
    closeModal,
  } = useModal<EditWorkModalPayload>("EditWorkModal");

  const { register, handleSubmit } = useForm<EditWorkModalPayload>({
    values: {
      name: payload?.name || "",
      id: payload?.id || "",
      imageUrl: payload?.imageUrl || "",
      chapter: payload?.chapter || 0,
      url: payload?.url || "",
    },
  });

  const [uploadWorkImage, { isLoading: isUploadingImage }] = useMutationSlice(
    uploadWorkImageCall,
    getReadWorksQuery,
  );

  const [updateWork, { isLoading }] = useMutationSlice(
    updateWorkCall,
    getReadWorksQuery,
  );

  const image = useAtomValue(imageFileAtom);

  function editWork({ id, ...payload }: any) {
    updateWork({
      data: payload,
      id,
    })
      .unwrap()
      .then(() => {
        toast({
          title: "Obra atualizada com sucesso",
          status: "success",
        });

        closeModal();
      })
      .catch(() => {
        toast({
          title: "Erro ao atualizar obra",
          status: "error",
        });
      });

    if (image) {
      const formData = new FormData();

      formData.append("file", image);
      formData.append("id", id);

      uploadWorkImage(formData)
        .unwrap()
        .then(() => {
          toast({
            title: "Imagem atualizada com sucesso",
            status: "success",
          });
        })
        .catch(() => {
          toast({
            title: "Erro ao atualizar imagem",
            status: "error",
          });
        });
    }
  }

  return (
    <Modal onClose={closeModal} isOpen={isOpen} size="2xl">
      <ModalHeader>
        <Heading size="md">Editar </Heading>
      </ModalHeader>

      <ModalBody>
        {payload && (
          <HStack>
            <ImageFileWithPreview
              defaultPreviewSrc={payload?.imageUrl || ""}
              acceptFileTypes={[".png", ".jpg", ".jpeg", "webp"]}
            />

            <VStack spacing="4" flex="1">
              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input type="text" {...register("name")} />
              </FormControl>

              <FormControl>
                <FormLabel>Url</FormLabel>
                <Input type="url" {...register("url")} />
              </FormControl>

              <FormControl>
                <FormLabel>Capitulo</FormLabel>
                <Input type="number" {...register("chapter")} />
              </FormControl>
            </VStack>
          </HStack>
        )}
      </ModalBody>

      <ModalFooter>
        <ButtonGroup spacing="4">
          <Button colorScheme="gray" onClick={closeModal} disabled={isLoading}>
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
      <ConfirmFinishWorkModal />

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
