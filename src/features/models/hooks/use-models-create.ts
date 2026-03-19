import { useRouter } from "next/navigation";
import { useCreateModel } from "./use-models";
import { ModelFormValues } from "../components/model-form-dialog";

export const useCreateModelRedirect = () => {
  const createModel = useCreateModel();
  const router = useRouter();

  const handleCreate = (values: ModelFormValues) => {
    createModel.mutate(values, {
      onSuccess: (data) => router.push(`/manufacturers/${data.manufacturerId}/models/${data.id}`),
    });
  };

  return { handleCreate, isPending: createModel.isPending };
};

export const useCreateModelInline = (onSuccess?: () => void) => {
  const createModel = useCreateModel();

  const handleCreate = (values: ModelFormValues) => {
    createModel.mutate(values, {
      onSuccess: (data) => {
        onSuccess?.();
      },
    });
  };

  return { handleCreate, isPending: createModel.isPending };
};