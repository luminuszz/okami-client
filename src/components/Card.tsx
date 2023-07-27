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
import React, { useEffect } from "react";

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
  children: React.ReactNode;
}

export function Card({ data, children }: Props) {
  const theme = useTheme() as any;

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
            height: 300,
            objectFit: "cover",
          }}
        />
        <Stack mt="6" spacing="3">
          <Heading size={["xs", "md"]} isTruncated>
            {data.title}
          </Heading>

          <Text color="blue.600" fontSize={["sm", "md"]}>
            {`Ultimo ${data.type === "MANGA" ? "Capitulo:" : "Episodio:"} ${
              data.chapter
            } `}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>{children}</CardFooter>
    </ChakraCard>
  );
}
