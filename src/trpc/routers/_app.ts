import { contactsRouter } from '@/features/contacts/server/router';
import { createTRPCRouter } from '../init';
import { workflowsRouter } from '@/features/workflows/server/router';
import { workordersRouter } from '@/features/workorders/server/router';
import { manufacturersRouter } from '@/features/manufacturers/server/router';
import { clientsRouter } from '@/features/clients/server/router';

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  workorders: workordersRouter,
  manufacturers: manufacturersRouter,
  clients: clientsRouter,
  contacts: contactsRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter;