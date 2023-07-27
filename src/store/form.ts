import { atom } from "jotai";
import { useAtom } from "jotai/react";
import { useCallback, useEffect } from "react";
import { func } from "prop-types";
import { isEmpty } from "lodash";

export const formStateAtom = atom<Record<string, any>>({});

interface FormMeta {
  touched: boolean;
  hasErrors: boolean;
}

export const formMetaStateAtom = atom<FormMeta>({
  touched: false,
  hasErrors: false,
});

export const formErrorStateAtom = atom<
  Record<string, { key: string; message: string }>
>({});

interface UseFormArgs<Values> {
  defaultValues: Values;
}

export const formManagerAtom = atom(
  (get) => get(formStateAtom),
  (get, set, args: any) => {
    set(formStateAtom, { ...get(formStateAtom), ...args });
  },
);

export function useForm<Values>({ defaultValues }: UseFormArgs<Values>) {
  const [form, setForm] = useAtom(formManagerAtom);
  const [errors, setErrors] = useAtom(formErrorStateAtom);
  const [formMeta, setFormMeta] = useAtom(formMetaStateAtom);

  const setFieldValue = useCallback(
    <Field extends keyof Values>(field: Field, value: Values[Field]) => {
      setForm({
        [field]: value,
      });
    },
    [setForm],
  );

  const handleSubmit = useCallback(
    (callback: (values: Values) => void) => {
      return () => {
        const hasErros = !isEmpty(errors);

        if (hasErros) {
          setFormMeta((old) => ({ ...old, hasErrors: true }));
          return;
        }

        callback(form as Values);
      };
    },
    [errors, form, setFormMeta],
  );

  useEffect(() => {
    setForm(defaultValues);
  }, [defaultValues, setForm]);

  return {
    values: form as Values,
    errors,
    formMeta,
    handleSubmit,
    setFieldValue,
  };
}
