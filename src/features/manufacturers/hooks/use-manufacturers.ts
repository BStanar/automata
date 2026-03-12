import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useManufacturersParams } from "./use-manufacturers-params";

/**
 * Hook to fetch all manufacturers using suspense
 */
export const useSuspenseManufacturers = () => {
   const trpc = useTRPC();
   const [params] = useManufacturersParams();

   return useSuspenseQuery(trpc.manufacturers.getMany.queryOptions(params));
};

/**
 * Hook to create a new manufacturer
 */
export const useCreateManufacturer = () => {
   const queryClient = useQueryClient();
   const trpc = useTRPC();

   return useMutation(
      trpc.manufacturers.create.mutationOptions({
         onSuccess: (data) => {
            toast.success(`Manufacturer "${data.name}" created`);
            queryClient.invalidateQueries(
               trpc.manufacturers.getMany.queryOptions({}),
            );
         },
         onError: (error) => {
            toast.error(`Failed to create manufacturer: ${error.message}`);
         }
   
      })
   );
}

export const useRemoveManufacturer = () => {
   const trpc = useTRPC();
   const queryClient = useQueryClient();
   const [params] = useManufacturersParams();

   return useMutation(
      trpc.manufacturers.remove.mutationOptions({
         onSuccess: (data) => {
            toast.success(`Manufacturer "${data.name}" removed`);
            queryClient.invalidateQueries(
               trpc.manufacturers.getMany.queryOptions(params)
            );
            
         },
         onError: (error) => {
            toast.error(`Failed to remove manufacturer: ${error.message}`);
         }
      })
   )
}

/**
 * Hook to fetch a single manufacturer using suspense
 */
export const useSuspenseManufacturer = (id: string) => {
   const trpc = useTRPC();

   return useSuspenseQuery(trpc.manufacturers.getOne.queryOptions({id}));
};

/**
 * Hook to update manufacturer name
 */
export const useUpdateManufacturer = () => {
   const queryClient = useQueryClient();
   const trpc = useTRPC();

   return useMutation(
      trpc.manufacturers.update.mutationOptions({
         onSuccess: async (data) => {
            toast.success(`Manufacturer "${data.name}" updated`);
               
            await queryClient.invalidateQueries(
               trpc.manufacturers.getMany.queryOptions({}),
            );            
            await queryClient.invalidateQueries(
               trpc.manufacturers.getOne.queryOptions({id: data.id}),
            );
         },
         onError: (error) => {
            toast.error(`Failed to update manufacturer: ${error.message}`);
         }
   
      })
   );
}