import { TRPCError } from '@trpc/server';
import dayjs from 'dayjs';
import { readFileSync, writeFileSync } from 'fs';
import _ from 'lodash';
import { z } from 'zod';

import { messages } from '~/factory/constants';

import { protectedProcedure } from '../trpc';

const FILE_PATH = './upload';

export const list = protectedProcedure
  .input(
    z.object({
      direction: z.number().min(1).max(2),
    }),
  )
  .query(async ({ input, ctx }) =>
    ctx.prisma.document.findMany({
      where: input,
    }),
  );

export const get = protectedProcedure
  .input(z.string().length(36))
  .query(async ({ input, ctx }) => {
    const doc = await ctx.prisma.document.findFirstOrThrow({
      where: { id: input },
      select: {
        createdUser: true,
        id: true,
        title: true,
        code: true,
        direction: true,
        documentTypeId: true,
        content: true,
        description: true,
        receiveUnit: true,
        receiver: true,
        date: true,
        signer: true,
        needReply: true,
        replyBy: true,
        replyDeadline: true,
        filePath: true,
        createdBy: true,
      },
    });
    let fileAsBase64: string | null = null;
    let fileName: string | null = null;
    if (doc.filePath) {
      fileAsBase64 = readFileSync(doc.filePath, { encoding: 'ascii' });
      fileName = doc.filePath.split('/').pop()!;
    }
    return {
      ..._.omit(doc, 'filePath'),
      fileAsBase64,
      fileName,
    };
  });

export const add = protectedProcedure
  .input(
    z.object({
      fileAsBase64: z.string().optional(),
      fileName: z.string().optional(),
      title: z.string().max(200),
      code: z.string().max(20),
      direction: z.number().min(1).max(2),
      documentTypeId: z.string().length(36),
      quantity: z.number().min(1),
      date: z.string().min(8).max(10),
      receiver: z.string().min(4).max(20),
      receiveUnit: z.string().min(4).max(20),
      signer: z.string().min(4).max(20),
      content: z.string().nonempty().max(5000),
      description: z.string().max(500),
      createdBy: z.string().length(36),
      needReply: z.boolean(),
      replyBy: z
        .union([z.string().length(0), z.string().length(36)])
        .nullable()
        .transform((e) => (e === '' || e === undefined ? null : e)),
      replyTo: z
        .union([z.string().length(0), z.string().length(36)])
        .nullable()
        .transform((e) => (e === '' || e === undefined ? null : e)),
      replyDeadline: z
        .union([z.string().length(0), z.string().min(8).max(10)])
        .nullable()
        .transform((e) => (e === '' || e === undefined ? null : e)),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    let filePath: string | null = `${FILE_PATH}/${dayjs().format(
      'YYYYMMDDHHmmss',
    )}_${input.fileName}`;
    if (input.fileAsBase64 && input.fileAsBase64.length > 0) {
      try {
        writeFileSync(filePath, input.fileAsBase64, { encoding: 'ascii' });
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: messages.fileInvalid,
        });
      }
    } else {
      filePath = null;
    }

    return ctx.prisma.document.create({
      data: {
        ..._.omit(input, ['fileAsBase64', 'fileName']),
        filePath,
      },
    });
  });

export const edit = protectedProcedure
  .input(
    z.object({
      fileAsBase64: z.string().optional(),
      fileName: z.string().optional(),
      id: z.string().length(36),
      title: z.string().max(200),
      code: z.string().max(20),
      direction: z.number().min(1).max(2),
      documentTypeId: z.string().length(36),
      quantity: z.number().min(1),
      date: z.string().min(8).max(10),
      receiver: z.string().min(4).max(20),
      receiveUnit: z.string().min(4).max(20),
      signer: z.string().min(4).max(20),
      content: z.string().nonempty().max(5000),
      description: z.string().max(500),
      createdBy: z.string().length(36),
      needReply: z.boolean(),
      replyBy: z
        .union([z.string().length(0), z.string().length(36)])
        .nullable()
        .transform((e) => (e === '' || e === undefined ? null : e)),
      replyTo: z
        .union([z.string().length(0), z.string().length(36)])
        .nullable()
        .transform((e) => (e === '' || e === undefined ? null : e)),
      replyDeadline: z
        .union([z.string().length(0), z.string().min(8).max(10)])
        .nullable()
        .transform((e) => (e === '' || e === undefined ? null : e)),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    let filePath: string | null = `${FILE_PATH}/${dayjs().format(
      'YYYYMMDDHHmmss',
    )}_${input.fileName}`;
    if (input.fileAsBase64 && input.fileAsBase64.length > 0) {
      try {
        writeFileSync(filePath, input.fileAsBase64, { encoding: 'ascii' });
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: messages.fileInvalid,
        });
      }
    } else {
      filePath = null;
    }

    return ctx.prisma.document.update({
      data: {
        ..._.omit(input, ['id', 'fileAsBase64', 'fileName']),
        filePath,
      },
      where: { id: input.id },
    });
  });

export const search = protectedProcedure
  .input(
    z.object({
      searchKey: z.string().max(20).optional(),
      code: z.string().max(20).optional(),
      direction: z.array(z.number().min(1).max(2)),
      documentTypeId: z.array(z.string().length(36)).optional(),
      date: z.string().max(10).optional(),
      receiver: z.string().max(20).optional(),
      receiveUnit: z.string().max(20).optional(),
      signer: z.string().max(20).optional(),
      content: z.string().max(5000).optional(),
      skip: z.number().optional(),
      limit: z.number().min(1),
    }),
  )
  .query(async ({ input, ctx }) => {
    if (input.searchKey) {
      const condition = {
        direction: { in: input.direction },
        OR: [
          { code: { contains: input.searchKey } },
          { signer: { contains: input.searchKey } },
          { receiveUnit: { contains: input.searchKey } },
          { receiver: { contains: input.searchKey } },
          { content: { contains: input.searchKey } },
        ],
      };

      return {
        data: await ctx.prisma.document.findMany({
          where: condition,
          take: input.limit,
          skip: input.skip,
        }),
        count: await ctx.prisma.document.count({
          where: condition,
        }),
      };
    }

    const codeCondition = input.code && { code: { contains: input.code } };
    const signerCondition = input.signer && {
      signer: { contains: input.signer },
    };
    const receiverCondition = input.receiver && {
      receiver: { contains: input.receiver },
    };
    const receiveUnitCondition = input.receiveUnit && {
      receiveUnit: { contains: input.receiveUnit },
    };
    const contentCondition = input.content && {
      content: { contains: input.content },
    };
    const dateCondition = input.date && {
      date: input.date,
    };
    const documentTypeIdCondition = input.documentTypeId instanceof Array &&
      input.documentTypeId.length > 0 && {
        documentTypeId: { in: input.documentTypeId },
      };

    const condition = {
      direction: { in: input.direction },
      ...codeCondition,
      ...signerCondition,
      ...receiverCondition,
      ...receiveUnitCondition,
      ...contentCondition,
      ...dateCondition,
      ...documentTypeIdCondition,
    };

    return {
      data: await ctx.prisma.document.findMany({
        where: condition,
        take: input.limit,
        skip: input.skip,
      }),
      count: await ctx.prisma.document.count({
        where: condition,
      }),
    };
  });

export const remove = protectedProcedure
  .input(z.string().length(36))
  .mutation(async ({ input, ctx }) =>
    ctx.prisma.document.delete({
      where: { id: input },
    }),
  );

export const assignedToMe = protectedProcedure.query(async ({ ctx }) =>
  ctx.prisma.document.findMany({
    where: {
      replyBy: ctx.auth!.user.id,
      repliedDocument: { is: null },
      ignoreReply: false,
    },
    orderBy: { createdAt: 'desc' },
  }),
);

export const ignoreDocReply = protectedProcedure
  .input(z.string().length(36))
  .mutation(async ({ ctx, input }) =>
    ctx.prisma.document.update({
      where: { id: input },
      data: { ignoreReply: true },
    }),
  );

export const summary = protectedProcedure
  .input(
    z.object({
      date: z.object({
        from: z.string().max(10),
        to: z.string().max(10),
      }),
      userId: z.string().length(36),
    }),
  )
  .query(async ({ ctx, input }) => {
    const createdDoc = ctx.prisma.document.count({
      where: {
        createdBy: input.userId,
        date: { gte: input.date.from, lte: input.date.to },
      },
    });
    const fulfilledDoc = ctx.prisma.document.count({
      where: {
        replyBy: input.userId,
        date: { gte: input.date.from, lte: input.date.to },
        NOT: { repliedDocument: { is: null } },
      },
    });
    const overlookedDoc = ctx.prisma.document.count({
      where: {
        replyBy: input.userId,
        date: { gte: input.date.from, lte: input.date.to },
        repliedDocument: { is: null },
      },
    });

    return {
      createdDoc: await createdDoc,
      fulfilledDoc: await fulfilledDoc,
      overlookedDoc: await overlookedDoc,
    };
  });
