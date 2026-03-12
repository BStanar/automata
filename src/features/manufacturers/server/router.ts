import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import { COUNTRY_CODES } from "@/config/countries";

const manufacturerInput = z.object({
  name: z.string().min(1, "Name is required").max(100),
  country: z.enum(COUNTRY_CODES, { error: "Invalid country" }),
  description: z.string().max(500).optional(),
});

export const manufacturersRouter = createTRPCRouter({
  create: protectedProcedure
    .input(manufacturerInput)
    .mutation(async ({ input }) => {
      return prisma.manufacturer.create({
        data: input,
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: manufacturerInput,
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.manufacturer.update({
        where: { id: input.id },
        data: {
          name: input.data.name,
          country: input.data.country,
          description: input.data.description,
        },
      });
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return prisma.manufacturer.delete({
        where: { id: input.id },
      });
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return prisma.manufacturer.findUniqueOrThrow({
        where: { id: input.id },
        include: {
          models: true,
        }
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
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const [items, totalCount] = await Promise.all([
        prisma.manufacturer.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            name: "asc",
          },
        }),
        prisma.manufacturer.count({
          where: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
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
});
