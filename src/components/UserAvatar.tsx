import { useUserDetails } from "@/store/user";
import { Avatar, HStack, Spinner, Tooltip } from "@chakra-ui/react";

export function UserAvatar() {
  const { user, isLoading } = useUserDetails();

  return (
    <HStack spacing="2">
      <Tooltip label={user?.name} aria-label="A tooltip">
        {!isLoading ? (
          <Avatar size="md" name={user?.name} src={user?.avatarImageUrl || ""} />
        ) : (
          <Spinner />
        )}
      </Tooltip>
    </HStack>
  );
}
