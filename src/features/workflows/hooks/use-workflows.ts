import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@/trpc/routers/_app';

type RouterOutputs = inferRouterOutputs<AppRouter>;

/**
 * Hook to fetch all workflows using suspense
 */
export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();
  const result = useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
  return result as typeof result & { data: RouterOutputs['workflows']['getMany'] };
};

/**
 * Hook to create a new workflow
 */
export const useCreateWorkflow = () => {
   const queryClient = useQueryClient();
   const trpc = useTRPC();

   return useMutation(
      trpc.workflows.create.mutationOptions({
         onSuccess: (data) => {
            toast.success(`Workflow "${data.name}" created`);
            queryClient.invalidateQueries(
               trpc.workflows.getMany.queryOptions({}),
            );
         },
         onError: (error) => {
            toast.error(`Failed to create workflow: ${error.message}`);
         }
   
      })
   );
}

export const useRemoveWorkflow = () => {
   const trpc = useTRPC();
   const queryClient = useQueryClient();

   return useMutation(
      trpc.workflows.remove.mutationOptions({
         onSuccess: (data) => {
            toast.success(`Workflow "${data.name}" removed`);
            queryClient.invalidateQueries(
               trpc.workflows.getMany.queryOptions({})
            );
            queryClient.invalidateQueries(
               trpc.workflows.getOne.queryFilter({ id: data.id })
            );
            
         },
         onError: (error) => {
            toast.error(`Failed to remove workflow: ${error.message}`);
         }
      })
   )
}

/**
 * Hook to fetch a single workflows using suspense
 */
export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC();
  const result = useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
  return result as typeof result & { data: RouterOutputs['workflows']['getOne'] };
};

/**
 * Hook to update workflow name
 */
export const useUpdateWorkflowName = () => {
   const queryClient = useQueryClient();
   const trpc = useTRPC();

   return useMutation(
      trpc.workflows.updateName.mutationOptions({
         onSuccess: async (data) => {
            toast.success(`Workflow "${data.name}" updated`);
            
            await  queryClient.invalidateQueries(
               trpc.workflows.getMany.queryOptions({}),
            );            
            await queryClient.invalidateQueries(
               trpc.workflows.getOne.queryOptions({id: data.id}),
            );
         },
         onError: (error) => {
            toast.error(`Failed to update workflow: ${error.message}`);
         }
   
      })
   );
}