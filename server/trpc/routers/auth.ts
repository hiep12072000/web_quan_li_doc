import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { z } from 'zod';

import { hashPassword } from '../../utils';
import { publicProcedure } from '../trpc';

export const login = publicProcedure
  .input(
    z.object({
      username: z
        .string()
        .regex(/[a-z0-9]+/, 'alphabet only')
        .min(4)
        .max(20),
      password: z.string().min(8).max(20),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const hashedPassword = hashPassword(input.password);
    const user = await ctx.prisma.user.findFirst({
      where: {
        username: input.username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        resetId: true,
      },
    });
    if (user) {
      const token = jwt.sign(
        { user, ipAddress: ctx.requestIp },
        process.env.AUTH_SECRET!,
        { expiresIn: process.env.JWT_EXPIRATION || '3600s' },
      );
      return { token, user };
    } else {
      return null;
    }
  });
