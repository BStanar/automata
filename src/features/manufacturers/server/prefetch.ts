import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";

 type Input = inferInput<typeof trpc.manufacturers.getMany>

 /**
  * Prefetch manufacturers
  */
 
 export const prefetchManufacturers = (params: Input) => {
   return prefetch(trpc.manufacturers.getMany.queryOptions(params))
 };
 export const prefetchManufacturer = ( id: string) => {
  return prefetch(trpc.manufacturers.getOne.queryOptions({ id }))
 };
 
 export const prefetchManufacturerContacts = (id: string) => {
  return prefetch(trpc.contacts.getByOwner.queryOptions({ manufacturerId: id }))
};