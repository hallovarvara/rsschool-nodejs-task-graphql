import { PrismaClient } from '@prisma/client';

export type DatabaseT = {
  prismaClient: PrismaClient;
};
