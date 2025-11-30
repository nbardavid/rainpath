import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

interface PrismaErrorContext {
  uniqueMessage?: string;
  notFoundMessage?: string;
}

export function translatePrismaError(
  error: unknown,
  context?: PrismaErrorContext,
): Error {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return new ConflictException(
          context?.uniqueMessage ?? 'Resource already exists.',
        );
      case 'P2025':
        return new NotFoundException(
          context?.notFoundMessage ?? 'Resource not found.',
        );
      default:
        break;
    }
  }

  return error instanceof Error
    ? error
    : new InternalServerErrorException('Unexpected database error.');
}
