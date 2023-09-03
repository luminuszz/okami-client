import { useAtom } from "jotai/react";
import { searchInputAtom } from "@/store/searchInput";
import { Flex, Input } from "@chakra-ui/react";

export function SearchInput() {
  const [search, setSearch] = useAtom(searchInputAtom);

  return (
    <Flex flex="1" w="full" maxW="600px" justify="center" alignItems="center">
      <Input
        placeholder="Pesuisar: Exemplo ''Naruto''"
        _placeholder={{ color: "gray.400" }}
        height="40px"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </Flex>
  );
}
