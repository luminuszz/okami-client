"use client";

import { Container, Grid, SimpleGrid } from "@chakra-ui/react";
import { Card } from "@/components/Card";
import { useQuerySlice } from "@/store/okami";
import { Work } from "@/services/okami";

export default function Home() {
  const { currentData } = useQuerySlice<Work[]>(
    "/work/fetch-for-workers-unread",
  );

  return (
    <Container pt="10" maxW="container.xl">
      <SimpleGrid columns={3} spacing={10}>
        {currentData?.map((work) => (
          <Card
            key={work.id}
            data={{
              title: work.name,
              id: work.id,
              type: "ANIME",
              img: work.imageUrl || "",
              chapter: work.chapter,
            }}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}
