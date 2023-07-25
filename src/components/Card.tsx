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
  Link,
} from "@chakra-ui/react";
import React from "react";

import Image from "next/image";
import { useTheme } from "@emotion/react";

type Type = "ANIME" | "MANGA";

interface Props {
  data: {
    title: string;
    img: string;
    id: string;
    type: Type;
    chapter: number;
  };
}

export function Card({ data }: Props) {
  const theme = useTheme() as any;

  return (
    <ChakraCard maxW="sm">
      <CardBody>
        <Image
          width={300}
          height={100}
          src={data.img || "/anime-default.jpg"}
          alt="Green double couch with wooden legs"
          style={{
            borderRadius: theme.radii.lg,
          }}
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{data.title}</Heading>

          <Text color="blue.600" fontSize="xl">
            {`${data.type === "MANGA" ? "Capitulo" : "Episodio"} ${
              data.chapter
            } `}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button variant="solid" colorScheme="blue">
            Marcar como lido
          </Button>

          <Button variant="ghost" colorScheme="blue">
            Ir para o site
          </Button>
        </ButtonGroup>
      </CardFooter>
    </ChakraCard>
  );
}
