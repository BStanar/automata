import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useContactsParams } from "./use-contacts-params";

/**
 * Hook to fetch all contacts using suspense
 */
export const useSuspenseContacts = () => {
   const trpc = useTRPC();
   const [params] = useContactsParams();

   return useSuspenseQuery(trpc.contacts.getMany.queryOptions(params));
};

/**
 * Hook to create a new contact
 */
export const useCreateContact = () => {
   const queryClient = useQueryClient();
   const trpc = useTRPC();

   return useMutation(
      trpc.contacts.create.mutationOptions({
         onSuccess: (data) => {
            toast.success(`Contact "${data.firstName}" created`);
            queryClient.invalidateQueries(
               trpc.contacts.getMany.queryOptions({}),
            );
         },
         onError: (error) => {
            toast.error(`Failed to create contact: ${error.message}`);
         }
   
      })
   );
}
export const useRemoveContact = () => {
   const trpc = useTRPC();
   const queryClient = useQueryClient();

   return useMutation(
      trpc.contacts.remove.mutationOptions({
         onSuccess: (data) => {
            toast.success(`Contact "${data.firstName}" "${data.lastName}" removed`);
            queryClient.invalidateQueries(
               trpc.contacts.getMany.queryOptions({})
            );
            
         },
         onError: (error) => {
            toast.error(`Failed to remove contact: ${error.message}`);
         }
      })
   )
}

/**
 * Hook to fetch a single contacts using suspense
 */
export const useSuspenseContact = (id: string) => {
   const trpc = useTRPC();

   return useSuspenseQuery(trpc.contacts.getOne.queryOptions({id}));
};

/**
 * Hook to update contact name
 */
export const useUpdateContactName = () => {
   const queryClient = useQueryClient();
   const trpc = useTRPC();

   return useMutation(
      trpc.contacts.update.mutationOptions({
         onSuccess: async (data) => {
            toast.success(`Contact "${data.firstName}" "${data.lastName}" updated`);
               
            await Promise.all([
               queryClient.invalidateQueries(
                  trpc.contacts.getMany.queryOptions({}),
               ),
               queryClient.cancelQueries(
                  trpc.contacts.getOne.queryOptions({id: data.id})
               ),
            ])
         },
         onError: (error) => {
            toast.error(`Failed to update contact: ${error.message}`);
         }
   
      })
   );
}