"use client";

import { useQuerySlice } from "@/store/api";
import { getReadWorksQuery, Work } from "@/services/okami";
import { Box, Button, ButtonGroup, Container, Progress, SimpleGrid, VStack } from "@chakra-ui/react";
import { Card } from "@/components/Card";
import { filter, map } from "lodash";
import React from "react";
import { SearchInput } from "@/components/Search";
import { useAtomValue } from "jotai/react";
import { lowerCaseSearchInputAtom } from "@/store/searchInput";
import { useModal } from "@/store/modal";
import { EditWorkModal, EditWorkModalPayload } from "@/components/readPage/EditWorkModal";
import { ConfirmFinishWorkModal, ConfirmModalPayload } from "@/components/readPage/ConfirmFinishModal";

interface WorkListProps {
  works: Work[];
}

function WorksList({ works }: WorkListProps) {
  const { openModal: openEditModal } = useModal<EditWorkModalPayload>("EditWorkModal");
  const { openModal: openConfirmModal } = useModal<ConfirmModalPayload>("ConfirmFinishWorkModal");

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

            <Button colorScheme="linkedin" onClick={() => handleOpenEditModal(work)}>
              Editar
            </Button>
          </ButtonGroup>
        </Card>
      ))}
    </SimpleGrid>
  );
}

export default function Page() {
  const { currentData = [], isLoading } = useQuerySlice<Work[]>(getReadWorksQuery);

  const searchFilter = useAtomValue(lowerCaseSearchInputAtom);

  const works = filter(currentData, ({ name }) => name.toLowerCase().includes(searchFilter)).sort((a) =>
    a.isFinished ? 1 : -1,
  );

  return (
    <>
      <EditWorkModal />
      <ConfirmFinishWorkModal />
      <Box mt="1">{isLoading && <Progress w="full" colorScheme="blue" size="xs" isIndeterminate />}</Box>
      <Container pt="10" maxW="full">
        <VStack spacing={5}>
          <SearchInput />
          <WorksList works={works} />;
        </VStack>
      </Container>
    </>
  );
}
