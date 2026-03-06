import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";

 type Input = inferInput<typeof trpc.workorders.getMany>

 /**
  * Prefetch all workorders
  */

 export const prefetchWorkorders = (params: Input) => {
   return prefetch(trpc.workorders.getMany.queryOptions(params))
 };

 export const prefetchWorkorder = ( id: string) => {
  return prefetch(trpc.workorders.getOne.queryOptions({ id }))
 }