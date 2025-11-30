import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSlideDto {
  @IsString()
  @IsNotEmpty()
  staining!: string;
}

export class CreateBlockDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateSlideDto)
  slides!: CreateSlideDto[];
}

export class CreateSpecimenDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateBlockDto)
  blocks!: CreateBlockDto[];
}

export class CreateCaseDto {
  @IsString()
  @IsNotEmpty()
  identifier!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateSpecimenDto)
  specimens!: CreateSpecimenDto[];
}
