import { useRouter } from "next/navigation";
import { useCreateClient } from "./use-clients";
import { ClientFormValues } from "../components/client-form-dialog";

export const useCreateClientRedirect = () => {
  const createClient = useCreateClient();
  const router = useRouter();

  const handleCreate = (values: ClientFormValues) => {
    createClient.mutate(values, {
      onSuccess: (data) => router.push(`/clients/${data.id}`),
    });
  };

  return { handleCreate, isPending: createClient.isPending };
};