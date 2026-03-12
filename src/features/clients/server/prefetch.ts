import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";

 type Input = inferInput<typeof trpc.clients.getMany>

 /**
  * Prefetch clients
  */
 
 export const prefetchClients = (params: Input) => {
   return prefetch(trpc.clients.getMany.queryOptions(params))
 };
 export const prefetchClient = ( id: string) => {
  return prefetch(trpc.clients.getOne.queryOptions({ id }))
 };