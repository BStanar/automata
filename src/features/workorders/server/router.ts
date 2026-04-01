import prisma from "@/lib/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import { WorkOrderType } from "@/generated/prisma/enums";

export const workordersRouter = createTRPCRouter({
   create: protectedProcedure
      .input(z.object({
         clientId: z.string(),
         WorkOrderType: z.enum(Object.values(WorkOrderType) as [WorkOrderType, ...WorkOrderType[]]),
         acceptingDescription: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
         return prisma.$transaction(async (tx) => {
            const year = new Date().getFullYear();
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year + 1, 0, 1);

            const count = await tx.workOrder.count({
               where: {
                  dateOpened: {
                     gte: startOfYear,
                     lte: endOfYear,
                  },
               },
            });

            const sequence = String(count + 1).padStart(3, "0");
            const caseNumber = `${year}-${sequence}`;

            return tx.workOrder.create({
               data: {
                  caseNumber,
                  clientId: input.clientId,
                  workOrderType: input.WorkOrderType,
                  createdByUserId: ctx.auth.user.id,
                  acceptingDescription: input.acceptingDescription,
               }
            })
         })
      }),
   remove: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => {
         return prisma.workOrder.delete({
            where: {
               id: input.id,
            }
         });
      }),

   getOne: protectedProcedure
      .input(z.object({  id : z.string() }))
      .query(({ input }) => {
         return prisma.workOrder.findUniqueOrThrow({
            where: { id: input.id },
            include: {
               client: {
                  select: {
                     id: true,
                     name: true,
                     streetAddress: true,
                     contacts: true,
                     devices: true,
                     contracts: true,
                  },
               },
               createdByUser:  true,
               attendingContact: true,
               contract: true,
               workOrderDevices: {
                  include: {
                     device: {
                     select: {
                        serialNumber: true,
                        installationDate: true,
                        installationLocationAddress: true,
                        installationLocationCity: true,
                        model: true,
                     },
                     },
                     spareParts: {
                     include: {
                        sparePart: true,
                     },
                     },
                  },
               },
         },
      });
   }),
      
   getMany: protectedProcedure
      .input(
         z.object({
            page: z.number().default(PAGINATION.DEFAULT_PAGE),
            pageSize: z
               .number()
               .min(PAGINATION.MIN_PAGE_SIZE)
               .max(PAGINATION.MAX_PAGE_SIZE)
               .default(PAGINATION.DEFAULT_PAGE_SIZE),
            search: z.string().default(""),
         })
      )
      .query(async ({ input }) => {
         const { page, pageSize, search } = input;

         const where = {
            client: {
               name: {
                  contains: search,
                  mode: "insensitive" as const,
               },
            }
         };

         const [items, totalCount] = await Promise.all([
            prisma.workOrder.findMany({
               skip: (page-1) * pageSize,
               take: pageSize,
               
               orderBy: {
                  updatedAt: "desc",
               },
            }),
            prisma.workOrder.count({ where }),
         ]);

         const totalPages = Math.ceil(totalCount / pageSize);
         const hasNextPage = page < totalPages;
         const hasPreviousPage = page> 1;

         return {
            items,
            page,
            pageSize,
            totalPages,
            totalCount,
            hasNextPage,
            hasPreviousPage,
         }
      }),
});