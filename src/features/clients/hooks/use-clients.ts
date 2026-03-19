import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useClientsParams } from "./use-clients-params";

/**
 * Hook to fetch all clients using suspense
 */
export const useSuspenseClients = () => {
   const trpc = useTRPC();
   const [params] = useClientsParams();

   return useSuspenseQuery(trpc.clients.getMany.queryOptions(params));
};

/**
 * Hook to create a new client
 */
export const useCreateClient = () => {
   const queryClient = useQueryClient();
   const trpc = useTRPC();

   return useMutation(
      trpc.clients.create.mutationOptions({
         onSuccess: (data) => {
            toast.success(`Client "${data.name}" created`);
            queryClient.invalidateQueries(
               { queryKey: trpc.clients.getMany.queryKey() }
            );
         },
         onError: (error) => {
            toast.error(`Failed to create client: ${error.message}`);
         }
   
      })
   );
}

export const useRemoveClient = () => {
   const trpc = useTRPC();
   const queryClient = useQueryClient();

   return useMutation(
      trpc.clients.remove.mutationOptions({
         onSuccess: (data) => {
            toast.success(`Client "${data.name}" removed`);
            queryClient.invalidateQueries(
               { queryKey: trpc.clients.getMany.queryKey() }
            );
            
         },
         onError: (error) => {
            toast.error(`Failed to remove client: ${error.message}`);
         }
      })
   )
}

/**
 * Hook to fetch a single client using suspense
 */
export const useSuspenseClient = (id: string) => {
   const trpc = useTRPC();

   return useSuspenseQuery(trpc.clients.getOne.queryOptions({id}));
};

/**
 * Hook to update client name
 */
export const useUpdateClient = () => {
   const queryClient = useQueryClient();
   const trpc = useTRPC();

   return useMutation(
      trpc.clients.update.mutationOptions({
         onSuccess: async (data) => {
            toast.success(`Client "${data.name}" updated`);
               
            await queryClient.invalidateQueries(
               { queryKey: trpc.clients.getMany.queryKey() }
            );            
            await queryClient.invalidateQueries(
               trpc.clients.getOne.queryOptions({id: data.id}),
            );
         },
         onError: (error) => {
            toast.error(`Failed to update client: ${error.message}`);
         }
   
      })
   );
}