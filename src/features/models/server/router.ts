import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import { RegulatoryStatus } from "@/generated/prisma/enums";
import { TRPCError } from "@trpc/server";

const modelInput = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required").max(100),
  regulatoryStatus: z
    .enum(
      Object.values(RegulatoryStatus) as [
        RegulatoryStatus,
        ...RegulatoryStatus[],
      ],
    )
    .optional(),
  endOfSaleDate: z.date().optional(),
  endOfSupportDate: z.date().optional(),

  manufacturerId: z.string().optional(),
});

export const modelsRouter = createTRPCRouter({
  create: protectedProcedure.input(modelInput).mutation(async ({ input }) => {
    return prisma.model.create({
      data: {
        name: input.name,
        description: input.description,
        regulatoryStatus: input.regulatoryStatus,
        endOfSaleDate: input.endOfSaleDate,
        endOfSupportDate: input.endOfSupportDate,
        manufacturer: input.manufacturerId
          ? { connect: { id: input.manufacturerId } }
          : undefined,
      },
    });
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: modelInput,
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.model.update({
        where: { id: input.id },
        data: {
          name: input.data.name,
          description: input.data.description,
          regulatoryStatus: input.data.regulatoryStatus,
          endOfSaleDate: input.data.endOfSaleDate,
          endOfSupportDate: input.data.endOfSupportDate,
          manufacturer: input.data.manufacturerId
            ? { connect: { id: input.data.manufacturerId } }
            : { disconnect: true },
        },
      });
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const deviceCount = await prisma.device.count({
        where: { modelId: input.id },
      });
      if (deviceCount > 0) {
        return prisma.model.update({
          where: { id: input.id },
          data: { deletedAt: new Date() },
        });
      }
      return prisma.model.delete({
        where: { id: input.id },
      });
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return prisma.model.findUniqueOrThrow({
        where: { id: input.id , deletedAt: null },
        include: {
          spareParts: true,
          manufacturer: true,
          devices: true,
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
        manufacturerId: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { page, pageSize, search, manufacturerId } = input;
      const where = {
         deletedAt: null,
        manufacturerId, // filter by manufacturer
        ...(search && {
          name: { contains: search, mode: "insensitive" as const },
        }),
      };
      const [items, totalCount] = await Promise.all([
        prisma.model.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: where,
          orderBy: {
            name: "asc",
          },
        }),
        prisma.model.count({
          where: where,
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalPages,
        totalCount,
        hasNextPage,
        hasPreviousPage,
      };
    }),
  getByOwner: protectedProcedure
    .input(
      z.object({
        manufacturerId: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      return prisma.model.findMany({
        where: {
          deletedAt: null,
          manufacturerId: input.manufacturerId,
        },
      });
    }),
});
