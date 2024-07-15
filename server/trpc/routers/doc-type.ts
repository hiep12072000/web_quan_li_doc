import { z } from 'zod';

import { protectedProcedure } from '../trpc';

export const list = protectedProcedure.query(async ({ ctx }) =>
  ctx.prisma.documentType.findMany(),
);

export const add = protectedProcedure
  .input(
    z.object({
      name: z.string().nonempty().max(20),
    }),
  )
  .mutation(async ({ input, ctx }) =>
    ctx.prisma.documentType.create({
      data: input,
    }),
  );

export const edit = protectedProcedure
  .input(
    z.object({
      id: z.string().nonempty().max(36),
      name: z.string().nonempty().max(20),
    }),
  )
  .mutation(async ({ input, ctx }) =>
    ctx.prisma.documentType.update({
      data: { name: input.name },
      where: { id: input.id },
    }),
  );

export const remove = protectedProcedure
  .input(
    z.object({
      id: z.string().nonempty().max(36),
    }),
  )
  .mutation(async ({ input, ctx }) =>
    ctx.prisma.documentType.delete({
      where: { id: input.id },
    }),
  );
