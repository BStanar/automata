import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useModelsParams } from "./use-models-params";

/**
 * Hook to fetch all models using suspense
 */
export const useSuspenseModels = () => {
   const trpc = useTRPC();
   const [params] = useModelsParams();

   return useSuspenseQuery(trpc.models.getMany.queryOptions(params));
};
/**
 * Hook to fetch all models by manufacturer using suspense
 */
export const useSuspenseModelsByOwner = (input: { manufacturerId?: string; }) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.models.getByOwner.queryOptions(input));
};

/**
 * Hook to create a new model
 */
export const useCreateModel = () => {
   const queryClient = useQueryClient();
   const trpc = useTRPC();

   return useMutation(
      trpc.models.create.mutationOptions({
         onSuccess: (data) => {
            toast.success(`Model "${data.name}" created`);
            
            queryClient.invalidateQueries({
               queryKey: trpc.models.getMany.queryKey(),
            });
            queryClient.invalidateQueries({
               queryKey: trpc.models.getByOwner.queryKey(),
            });
            if (data.manufacturerId) {
               queryClient.invalidateQueries({
                  queryKey: trpc.models.getByOwner.queryKey({ 
                     manufacturerId: data.manufacturerId 
                  }),
               });
            }
         },
         onError: (error) => {
            toast.error(`Failed to create model: ${error.message}`);
         }
   
      })
   );
}

export const useRemoveModel = () => {
   const trpc = useTRPC();
   const queryClient = useQueryClient();

   return useMutation(
      trpc.models.remove.mutationOptions({
         onSuccess: (data) => {
            toast.success(`Model "${data.name}" removed`);
            
            queryClient.invalidateQueries({
               queryKey: trpc.models.getMany.queryKey(),
            });
            queryClient.invalidateQueries({
               queryKey: trpc.models.getByOwner.queryKey(),
            });
            
            if (data.manufacturerId) {
               queryClient.invalidateQueries({
                  queryKey: trpc.models.getByOwner.queryKey({ 
                     manufacturerId: data.manufacturerId 
                  }),
               });
            }
         },
         onError: (error) => {
            toast.error(`Failed to remove model: ${error.message}`);
         }
      })
   )
}

/**
 * Hook to fetch a single model using suspense
 */
export const useSuspenseModel = (id: string) => {
   const trpc = useTRPC();

   return useSuspenseQuery(trpc.models.getOne.queryOptions({id}));
};

/**
 * Hook to update model name
 */
export const useUpdateModel = () => {
   const queryClient = useQueryClient();
   const trpc = useTRPC();

   return useMutation(
      trpc.models.update.mutationOptions({
         onSuccess: async (data) => {
            toast.success(`Model "${data.name}" updated`);
               
            await queryClient.invalidateQueries(
               trpc.models.getMany.queryOptions({}),
            );            
            await queryClient.invalidateQueries(
               trpc.models.getOne.queryOptions({id: data.id}),
            );
         },
         onError: (error) => {
            toast.error(`Failed to update model: ${error.message}`);
         }
   
      })
   );
}

/**
 * Hook to invalidate owners models
 */

export const useInvalidateOwnerModels = (input: { manufacturerId?: string; clientId?: string }) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return () => {
    queryClient.invalidateQueries({
      queryKey: trpc.models.getByOwner.queryKey(input),
    });
  };
};