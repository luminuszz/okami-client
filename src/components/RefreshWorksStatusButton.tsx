import { Icon, IconButton, Spinner, Theme, useToast } from "@chakra-ui/react";
import { RefreshCcw } from "lucide-react";
import { useTheme } from "@emotion/react";
import { useQuerySlice } from "@/store/api";
import { refreshWorkStatusQuery } from "@/services/okami";
import { useEffect } from "react";

const RefreshIcon = () => {
  const { colors } = useTheme() as Theme;

  return (
    <Icon as={() => <RefreshCcw size={25} color={colors.gray["300"]} />} />
  );
};

export function RefreshWorksStatusButton() {
  const toast = useToast();
  const { refetch, isLoading, error } = useQuerySlice(
    refreshWorkStatusQuery,
    true,
  );

  function handleRefresh() {
    refetch();
  }

  useEffect(() => {
    if (!isLoading && error) {
      toast({
        title: "Erro a atualizar o estado das obras",
        status: "error",
      });
    }

    if (!isLoading && !error) {
      toast({
        title: "Estado das obras atualizado com sucesso",
        status: "success",
      });
    }
  }, [error, isLoading, toast]);

  return isLoading ? (
    <Spinner size="sm" />
  ) : (
    <IconButton
      onClick={handleRefresh}
      aria-label="refresh works"
      icon={<RefreshIcon />}
    />
  );
}
