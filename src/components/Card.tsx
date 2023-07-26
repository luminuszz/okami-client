import {
  Card as ChakraCard,
  CardBody,
  Stack,
  Heading,
  Divider,
  Button,
  ButtonGroup,
  CardFooter,
  Text,
} from "@chakra-ui/react";
import React from "react";

import Image from "next/image";
import { useTheme } from "@emotion/react";
import { useAtom } from "jotai/react";
import { openMarkReadModalAtomAction } from "@/store/modal";

type Type = "ANIME" | "MANGA";

interface Props {
  data: {
    title: string;
    img: string;
    id: string;
    type: Type;
    chapter: number;
    url: string;
  };
}

export function Card({ data }: Props) {
  const theme = useTheme() as any;

  const [, openModal] = useAtom(openMarkReadModalAtomAction);

  function handleMarkRead() {
    openModal({
      chapter: data.chapter,
      id: data.id,
      name: data.title,
    });
  }

  return (
    <ChakraCard maxW="sm">
      <CardBody>
        <Image
          width={300}
          height={100}
          src={data.img || "/anime-default.jpg"}
          alt={data.title}
          style={{
            borderRadius: theme.radii.lg,
            width: "100%",
            height: 200,
            objectFit: "cover",
          }}
        />
        <Stack mt="6" spacing="3">
          <Heading size="md" isTruncated>
            {data.title}
          </Heading>

          <Text color="blue.600" fontSize="xl">
            {`Ultimo ${data.type === "MANGA" ? "Capitulo:" : "Episodio:"} ${
              data.chapter
            } `}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button variant="solid" colorScheme="blue" onClick={handleMarkRead}>
            Marcar como lido
          </Button>

          <Button
            variant="ghost"
            colorScheme="blue"
            href={data.url}
            target="_blank"
            as={"a"}
          >
            Ir para o site
          </Button>
        </ButtonGroup>
      </CardFooter>
    </ChakraCard>
  );
}
