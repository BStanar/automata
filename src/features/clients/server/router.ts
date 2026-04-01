import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import { BaMunicipality } from "@/config/municipalities";

const clientInput = z.object({
  name: z.string().min(1, "Name is required").max(100),
  registrationNumber: z.string().optional(),
  vatNumber: z.string().optional(),
  streetAddress: z.string().min(1, "Street address is required").max(100),
  city: z.enum(BaMunicipality, { error: "Invalid municipality" }),
  postalCode: z.string(),
  telephoneNumber: z.string().optional(),
  telephoneNumberSecondary: z.string().optional(),
  faxNumber: z.string().optional(),
  email: z.email(),
});

export const clientsRouter = createTRPCRouter({
  create: protectedProcedure.input(clientInput).mutation(async ({ input }) => {
    return prisma.client.create({
      data: input,
    });
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: clientInput,
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.client.update({
        where: { id: input.id },
        data: {
          name: input.data.name,
          registrationNumber: input.data.registrationNumber,
          vatNumber: input.data.vatNumber,
          streetAddress: input.data.streetAddress,
          city: input.data.city,
          postalCode: input.data.postalCode,
          telephoneNumber: input.data.telephoneNumber,
          telephoneNumberSecondary: input.data.telephoneNumberSecondary,
          faxNumber: input.data.faxNumber,
          email: input.data.email,
        },
      });
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return prisma.client.delete({
        where: { id: input.id },
      });
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return prisma.client.findUniqueOrThrow({
        where: { id: input.id },
        include: {
          contracts: true,
          contacts: true,
          devices: true,
          workOrders: true,
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
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const [items, totalCount] = await Promise.all([
        prisma.client.findMany({
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
        prisma.client.count({
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
