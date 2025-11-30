import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { translatePrismaError } from '../prisma/prisma-error.util';
import { CreateCaseDto } from './dto/create-case.dto';

const caseHierarchyInclude = {
  specimens: {
    orderBy: { createdAt: 'asc' },
    include: {
      blocks: {
        orderBy: { createdAt: 'asc' },
        include: {
          slides: {
            orderBy: { createdAt: 'asc' },
          },
        },
      },
    },
  },
} as const;

export type CaseWithHierarchy = Prisma.CaseGetPayload<{
  include: typeof caseHierarchyInclude;
}>;

@Injectable()
export class CasesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCase(dto: CreateCaseDto): Promise<CaseWithHierarchy> {
    try {
      return await this.prisma.case.create({
        data: {
          identifier: dto.identifier,
          specimens: {
            create: dto.specimens.map((specimen) => ({
              blocks: {
                create: specimen.blocks.map((block) => ({
                  slides: {
                    create: block.slides.map((slide) => ({
                      staining: slide.staining,
                    })),
                  },
                })),
              },
            })),
          },
        },
        include: caseHierarchyInclude,
      });
    } catch (error) {
      throw translatePrismaError(error, {
        uniqueMessage: 'A case with the same identifier already exists.',
      });
    }
  }

  async findAll(): Promise<CaseWithHierarchy[]> {
    return this.prisma.case.findMany({
      include: caseHierarchyInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number): Promise<CaseWithHierarchy | null> {
    return this.prisma.case.findUnique({
      where: { id },
      include: caseHierarchyInclude,
    });
  }

  async deleteCase(id: number): Promise<void> {
    try {
      await this.prisma.case.delete({
        where: { id },
      });
    } catch (error) {
      throw translatePrismaError(error, {
        notFoundMessage: `Case with id ${id} not found`,
      });
    }
  }
}
