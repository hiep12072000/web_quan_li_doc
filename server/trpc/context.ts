import { inferAsyncReturnType } from '@trpc/server';
import type { H3Event } from 'h3';
import jwt from 'jsonwebtoken';

import { UserInfo } from '~/factory/types/auth';

type TokenPayload = {
  user: UserInfo;
  ipAddress: string;
} | null;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(event: H3Event) {
  const requestIp = getRequestIP(event);
  const token = (getRequestHeader(event, 'Authorization') || '').split(' ')[1];
  let auth: TokenPayload = null;
  if (token) {
    try {
      auth = jwt.verify(token, process.env.AUTH_SECRET!) as TokenPayload;
      // if (requestIp !== auth!.ipAddress) {
      //   auth = null;
      // }
      await event.context.prisma.user.findFirstOrThrow({
        where: auth!.user,
      });
    } catch (err) {
      // invalid token
      auth = null;
    }
  }

  return {
    prisma: event.context.prisma,
    requestIp,
    auth,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
