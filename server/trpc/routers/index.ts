import { z } from 'zod';

import { publicProcedure, router } from '../trpc';
import * as authRouter from './auth';
import * as docRouter from './doc';
import * as docTypeRouter from './doc-type';
import * as userRouter from './user';

export const appRouter = router({
  auth: router(authRouter),
  doc: router(docRouter),
  docType: router(docTypeRouter),
  user: router(userRouter),
  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      }),
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
        time: new Date(),
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
