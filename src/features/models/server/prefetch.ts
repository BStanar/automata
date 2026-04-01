import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";

 type Input = inferInput<typeof trpc.models.getMany>

 /**
  * Prefetch models
  */
 
 export const prefetchModels = (params: Input) => {
   return prefetch(trpc.models.getMany.queryOptions(params))
 };
 export const prefetchModel = ( id: string) => {
  return prefetch(trpc.models.getOne.queryOptions({ id }))
 };
 
 export const prefetchModelContacts = (id: string) => {
  return prefetch(trpc.contacts.getByOwner.queryOptions({ modelId: id }))
};