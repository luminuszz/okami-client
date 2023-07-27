import { FormLabel, Image, useToast } from "@chakra-ui/react";
import { Input } from "@chakra-ui/input";
import React, { useEffect } from "react";
import { useAtom, useAtomValue } from "jotai/react";
import {
  imageCreatedByFileOrDefaultPreviewAtom,
  imageFileAtom,
  imagePreviewAtom,
} from "@/store/imageFileWithPreview";

interface Props {
  acceptFileTypes?: string[];
  defaultPreviewSrc?: string;
}

export function ImageFileWithPreview({
  acceptFileTypes,
  defaultPreviewSrc,
}: Props) {
  const toast = useToast();

  const [, setImage] = useAtom(imageFileAtom);
  const [, setImagePreview] = useAtom(imagePreviewAtom);

  const [imageDefaultPreviewOrImageFilePreview, clearPreview] = useAtom(
    imageCreatedByFileOrDefaultPreviewAtom,
  );

  function handleChangeImage(image?: File) {
    if (image && acceptFileTypes?.length) {
      const fileTypes = acceptFileTypes.map((type) => type.replace(".", ""));

      const fileType = image.type.split("/")[1];

      if (fileTypes.includes(fileType)) {
        setImage(image);
      } else {
        setImage(null);

        toast({
          title: "Tipos de imagem inválido",
          description: `Os tipos de imagem aceitos são: ${acceptFileTypes.join(
            `, `,
          )}`,
          status: "error",
        });
      }
    }
  }

  useEffect(() => {
    return () => {
      clearPreview();
    };
  }, []);

  useEffect(() => {
    defaultPreviewSrc && setImagePreview(defaultPreviewSrc);
  }, [defaultPreviewSrc]);

  return (
    <FormLabel htmlFor="fileInput" cursor="pointer">
      <Image
        borderRadius="md"
        objectFit="cover"
        alt="preview"
        src={imageDefaultPreviewOrImageFilePreview}
        w="200px"
        height="200px"
      />

      <Input
        accept="image/*"
        id="fileInput"
        type="file"
        display="none"
        onChange={({ target }) => {
          handleChangeImage(target.files?.[0]);
        }}
      />
    </FormLabel>
  );
}
