import {
  Card as ChakraCard,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { formatDistance, parseISO } from "date-fns";

import Image from "next/image";
import { useTheme } from "@emotion/react";
import { ptBR } from "date-fns/locale";
import { Book, Clock } from "lucide-react";

type Type = "ANIME" | "MANGA";

interface Props {
  data: {
    title: string;
    img: string;
    id: string;
    type: Type;
    chapter: number;
    url: string;
    nextChapter: number | null;
    nextChapterUpdatedAt: string;
  };
  children: React.ReactNode;
}

const defaultCardImage = "https://okami-storage.s3.amazonaws.com/work-images/animes-default.jpg";

export function Card({ data, children }: Props) {
  const { colors } = useTheme() as any;

  const theme = useTheme() as any;

  const currentTimeDistance = data.nextChapterUpdatedAt
    ? formatDistance(new Date(), parseISO(data.nextChapterUpdatedAt), {
        addSuffix: false,
        includeSeconds: true,
        locale: ptBR,
      })
    : null;

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

          {data.nextChapter ? (
            <HStack>
              <Book size={16} color={colors.green[400]} />
              <Text fontWeight="600" color="green.400" fontSize={["sm", "md"]}>
                {`Novo ${data.type === "MANGA" ? "Capitulo:" : "Episodio:"} ${data.chapter} `}
              </Text>
            </HStack>
          ) : (
            <HStack>
              <Book size={16} color={colors.blue[500]} />
              <Text fontWeight="600" color="blue.400" fontSize={["sm", "md"]}>
                {`Ultimo ${data.type === "MANGA" ? "Capitulo:" : "Episodio:"} ${data.chapter} `}
              </Text>
            </HStack>
          )}

          {currentTimeDistance && (
            <HStack>
              <Clock size={16} color={colors.gray[100]} />
              <Text fontWeight="600" color="gray.200" fontSize={["sm", "md"]}>
                {`Atualizado ha ${currentTimeDistance}`}
              </Text>
            </HStack>
          )}
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>{children}</CardFooter>
    </ChakraCard>
  );
}
