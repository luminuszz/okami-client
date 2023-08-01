import { Card as ChakraCard, CardBody, CardFooter, Divider, Heading, Stack, Text } from "@chakra-ui/react";
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
    url: string;
  };
  children: React.ReactNode;
}

const defaultCardImage = "https://okami-storage.s3.amazonaws.com/work-images/animes-default.jpg";

export function Card({ data, children }: Props) {
  const theme = useTheme() as any;

  return (
    <ChakraCard maxW="sm">
      <CardBody>
        <Image
          placeholder="blur"
          blurDataURL={data.img || defaultCardImage}
          width={300}
          height={100}
          src={data.img || defaultCardImage}
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
            {`Ultimo ${data.type === "MANGA" ? "Capitulo:" : "Episodio:"} ${data.chapter} `}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>{children}</CardFooter>
    </ChakraCard>
  );
}
