import { Flex, IconButton, Theme, VStack } from "@chakra-ui/react";
import { Book, BookMarked } from "lucide-react";
import { Icon as ChakraIcon } from "@chakra-ui/icons";
import { useTheme } from "@emotion/react";
import { useRouter } from "next/navigation";

const navBarSections = [
  {
    name: "Não lidos",
    icon: BookMarked,
    route: "/works/unread",
  },
  {
    name: "Lidos",
    icon: Book,
    route: "/works/read",
  },
];

export function Navbar() {
  const theme = useTheme() as Theme;

  const { push } = useRouter();

  return (
    <Flex
      alignItems="flex-start"
      mt="2"
      bgColor="blue.800"
      w="62px"
      h="100%"
      borderRightRadius="lg"
    >
      <VStack spacing={5} p="2">
        {navBarSections.map(({ name, icon: Icon, route }) => (
          <IconButton
            onClick={() => push(route)}
            key={name}
            aria-label={name}
            icon={<ChakraIcon as={() => <Icon size={30} color={theme.colors.gray["300"]} />} />}
            size="lg"
            variant="ghost"
          />
        ))}
      </VStack>
    </Flex>
  );
}
