/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { Context } from '~/server/trpc/context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;
export const router = t.router;
export const middleware = t.middleware;

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth?.user.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx });
});
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAuthed).use(
  t.middleware(({ next, ctx }) => {
    if (![9, 0].includes(ctx.auth!.user.role)) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    return next({ ctx });
  }),
);
