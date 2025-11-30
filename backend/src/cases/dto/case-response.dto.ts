import type { CaseWithHierarchy } from '../cases.repository';

export class SlideResponseDto {
  constructor(partial: Partial<SlideResponseDto>) {
    Object.assign(this, partial);
  }

  id!: number;
  staining!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class BlockResponseDto {
  constructor(partial: Partial<BlockResponseDto>) {
    Object.assign(this, partial);
  }

  id!: number;
  createdAt!: Date;
  updatedAt!: Date;
  slides!: SlideResponseDto[];
}

export class SpecimenResponseDto {
  constructor(partial: Partial<SpecimenResponseDto>) {
    Object.assign(this, partial);
  }

  id!: number;
  createdAt!: Date;
  updatedAt!: Date;
  blocks!: BlockResponseDto[];
}

export class CaseResponseDto {
  constructor(partial: Partial<CaseResponseDto>) {
    Object.assign(this, partial);
  }

  id!: number;
  identifier!: string;
  createdAt!: Date;
  updatedAt!: Date;
  specimens!: SpecimenResponseDto[];
}

export function toCaseResponseDto(caseRecord: CaseWithHierarchy): CaseResponseDto {
  return new CaseResponseDto({
    id: caseRecord.id,
    identifier: caseRecord.identifier,
    createdAt: caseRecord.createdAt,
    updatedAt: caseRecord.updatedAt,
    specimens: caseRecord.specimens.map(
      (specimen) =>
        new SpecimenResponseDto({
          id: specimen.id,
          createdAt: specimen.createdAt,
          updatedAt: specimen.updatedAt,
          blocks: specimen.blocks.map(
            (block) =>
              new BlockResponseDto({
                id: block.id,
                createdAt: block.createdAt,
                updatedAt: block.updatedAt,
                slides: block.slides.map(
                  (slide) =>
                    new SlideResponseDto({
                      id: slide.id,
                      staining: slide.staining,
                      createdAt: slide.createdAt,
                      updatedAt: slide.updatedAt,
                    }),
                ),
              }),
          ),
        }),
    ),
  });
}

export function toCaseResponseDtoList(
  caseRecords: CaseWithHierarchy[],
): CaseResponseDto[] {
  return caseRecords.map((caseRecord) => toCaseResponseDto(caseRecord));
}
