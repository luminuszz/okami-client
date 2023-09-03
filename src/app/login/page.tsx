"use client";

import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutationSlice } from "@/store/api";
import { makeLoginCall } from "@/services/okami";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(5),
});

type FormType = z.infer<typeof schema>;

export default function LoginPage() {
  const toast = useToast();
  const router = useRouter();
  const [makeLogin, { isLoading }] = useMutationSlice(makeLoginCall);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    values: {
      email: "",
      password: "",
    },
    reValidateMode: "onBlur",
    resolver: zodResolver(schema),
  });

  function handleLogin(payload: FormType) {
    makeLogin(payload)
      .unwrap()
      .then((result) => {
        localStorage.setItem("token", result.token);
        router.push("/works/unread");
      })
      .catch(() => {
        toast({
          title: "Erro ao fazer login",
          status: "error",
        });
      });
  }

  return (
    <Flex flex="1" width="full" height="100vh" justifyContent="center" alignItems="center">
      <VStack>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel>E-mail</FormLabel>
          <Input type="email" {...register("email")} />
          <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>Senha</FormLabel>
          <Input type="password" {...register("password")} />
          {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
        </FormControl>

        <FormControl mt="2">
          <Button
            isLoading={isLoading}
            onClick={handleSubmit(handleLogin)}
            colorScheme="green"
            width="full"
          >
            Login
          </Button>
        </FormControl>
      </VStack>
    </Flex>
  );
}
