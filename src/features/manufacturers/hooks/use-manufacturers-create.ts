import { useRouter } from "next/navigation";
import { useCreateManufacturer } from "./use-manufacturers";
import { ManufacturerFormValues } from "../components/manufacturer-form-dialog";

export const useCreateManufacturerRedirect = () => {
  const createManufacturer = useCreateManufacturer();
  const router = useRouter();

  const handleCreate = (values: ManufacturerFormValues) => {
    createManufacturer.mutate(values, {
      onSuccess: (data) => router.push(`/manufacturers/${data.id}`),
    });
  };

  return { handleCreate, isPending: createManufacturer.isPending };
};