import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  ModalBody,
  ModalFooter,
  ModalHeader,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useModal } from "@/store/modal";
import { useForm } from "react-hook-form";
import { useMutationSlice } from "@/store/api";
import { getReadWorksQuery, updateWorkCall, uploadWorkImageCall } from "@/services/okami";
import { useAtomValue } from "jotai/react";
import { imageFileAtom } from "@/store/imageFileWithPreview";
import { Modal } from "@/components/Modal";
import { ImageFileWithPreview } from "@/components/ImageFileWithPreview";
import { Input } from "@chakra-ui/input";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageCompressor from "compressorjs";

export interface EditWorkModalPayload {
  name: string;
  id: string;
  chapter: number;
  imageUrl: string | null;
  url: string;
}

const schema = z.object({
  id: z.string(),
  name: z
    .string()
    .optional()
    .transform((value) => value?.trim()),
  url: z.string().url().optional(),
  chapter: z
    .string()
    .or(z.number())
    .optional()
    .transform((value) => Number(value) || undefined),
  imageUrl: z.string().optional().nullable(),
});

type FormSchema = z.infer<typeof schema>;

export function EditWorkModal() {
  const [uploadWorkImage] = useMutationSlice(uploadWorkImageCall, getReadWorksQuery);
  const [updateWork, { isLoading }] = useMutationSlice(updateWorkCall, getReadWorksQuery);

  const toast = useToast();
  const {
    modal: { payload, isOpen },
    closeModal,
  } = useModal<EditWorkModalPayload>("EditWorkModal");

  const { register, handleSubmit } = useForm<FormSchema>({
    defaultValues: {
      chapter: 0,
      url: "",
      name: "",
      id: "",
      imageUrl: "",
    },

    values: {
      name: payload?.name,
      id: payload?.id || "",
      imageUrl: payload?.imageUrl,
      chapter: payload?.chapter,
      url: payload?.url,
    },
    resolver: zodResolver(schema as any),
  });

  const image = useAtomValue(imageFileAtom);

  function editWork(payload: FormSchema) {
    const data = {
      ...payload,
      chapter: Number(payload.chapter),
    };

    updateWork(data)
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
      new ImageCompressor(image, {
        convertSize: 100000,
        resize: "cover",
        quality: 0.8,
        success: (file) => {
          const formData = new FormData();

          formData.append("file", file);
          formData.append("id", payload.id);

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
        },
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
          <Button colorScheme="green" onClick={handleSubmit(editWork)} isLoading={isLoading}>
            Salvar
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
}
