import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { messages } from '~/factory/constants';

import { hashPassword } from '../../utils';
import { adminProcedure, protectedProcedure } from '../trpc';

export const list = protectedProcedure.query(async ({ ctx }) =>
  ctx.prisma.user.findMany({
    where: { role: { not: 9 } },
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
    },
  }),
);

export const changePassword = protectedProcedure
  .input(
    z.object({
      oldPassword: z.string().min(8).max(20),
      password: z.string().min(8).max(20),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    try {
      await ctx.prisma.user.update({
        where: {
          id: ctx.auth!.user.id,
          password: hashPassword(input.oldPassword),
        },
        data: { password: hashPassword(input.password) },
      });
      return true;
    } catch (err) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: messages.oldPasswordNotCorrect,
      });
    }
  });

export const add = adminProcedure
  .input(
    z.object({
      name: z.string().min(4).max(20),
      username: z.string().min(4).max(20),
      role: z.string().min(1).max(1),
      password: z.string().min(8).max(20),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const existingUserName = await ctx.prisma.user.count({
      where: { username: input.username },
    });
    if (existingUserName > 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: messages.usernameExist,
      });
    }

    const hashedPassword = hashPassword(input.password);

    await ctx.prisma.user.create({
      data: {
        name: input.name,
        username: input.username,
        role: Number(input.role),
        password: hashedPassword,
      },
    });
  });

export const edit = adminProcedure
  .input(
    z.object({
      id: z.string().nonempty().min(36).max(36),
      name: z.string().nonempty().min(4).max(20),
      password: z
        .string()
        .min(8)
        .max(20)
        .or(z.literal(''))
        .nullable()
        .transform((e) => (e === '' || e === undefined ? null : e)),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const hashedPassword = hashPassword(input.password);

    return ctx.prisma.user.update({
      data: {
        name: input.name,
        ...(hashedPassword ? { password: hashedPassword } : {}),
      },
      where: { id: input.id },
    });
  });

export const remove = adminProcedure
  .input(
    z.object({
      id: z.string().nonempty().max(36),
    }),
  )
  .mutation(async ({ input, ctx }) =>
    ctx.prisma.user.delete({
      where: { id: input.id },
    }),
  );
