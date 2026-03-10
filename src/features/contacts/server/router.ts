import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import { ContactOwnerType, ContactRole } from "@/generated/prisma/enums";

const contactInput = z.object({
  firstName: z.string().min(1, "Firstname is required").max(15),
  lastName: z.string().min(1, "Lastname is required").max(15),
  telephoneNumber: z.string().min(1).max(25),
  telephoneNumberSecondary: z.string().min(1).max(25).optional(),
  email: z.email("Invalid email adress"), 
  role: z.enum(Object.values(ContactRole) as [ContactRole, ... ContactRole[]]),
  isActive: z.boolean().default(true),

  ownerType: z.enum(Object.values(ContactOwnerType) as [ContactOwnerType, ... ContactOwnerType[]]),
  clientId: z.string().optional(),
  manufacturerId: z.string().optional(),
});

export const contactsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(contactInput)
    .mutation(async ({ input }) => {
      return prisma.contact.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          telephoneNumber: input.telephoneNumber,
          telephoneNumberSecondary: input.telephoneNumberSecondary,
          email: input.email,
          isActive: input.isActive,
          role: input.role,
          ownerType: input.ownerType,
          clientId: input.clientId,
          manufacturerId: input.manufacturerId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: contactInput,
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.contact.update({
        where: { id: input.id },
        data: {
          firstName: input.data.firstName,
          lastName: input.data.lastName,
          telephoneNumber: input.data.telephoneNumber,
          telephoneNumberSecondary: input.data.telephoneNumberSecondary,
          email: input.data.email,
          role: input.data.role,
          ownerType: input.data.ownerType,
          clientId: input.data.clientId,
          manufacturerId: input.data.manufacturerId,
        },
      });
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return prisma.contact.update({
        where: { id: input.id },
        data: { isActive: false },
      });
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return prisma.contact.findUniqueOrThrow({
        where: { 
          id: input.id,
          isActive: true,
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
    .query(async ({ input }) => {
      

      const { page, pageSize, search } = input;
      const where = {
        isActive: true,
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
          ],
        }),
      };
      const [items, totalCount] = await Promise.all([
        prisma.contact.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where,
          orderBy: {
            lastName: "asc",
          },
        }),
        prisma.contact.count({ where }),
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
