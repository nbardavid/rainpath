import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCaseDto } from './dto/create-case.dto';
import {
  CaseResponseDto,
  toCaseResponseDto,
  toCaseResponseDtoList,
} from './dto/case-response.dto';
import { CasesRepository } from './cases.repository';

@Injectable()
export class CasesService {
  constructor(private readonly casesRepository: CasesRepository) {}

  async createCase(dto: CreateCaseDto): Promise<CaseResponseDto> {
    const createdCase = await this.casesRepository.createCase(dto);
    return toCaseResponseDto(createdCase);
  }

  async listCases(): Promise<CaseResponseDto[]> {
    const caseRecords = await this.casesRepository.findAll();
    return toCaseResponseDtoList(caseRecords);
  }

  async getCase(id: number): Promise<CaseResponseDto> {
    const caseRecord = await this.casesRepository.findById(id);
    if (!caseRecord) {
      throw new NotFoundException(`Case with id ${id} not found`);
    }
    return toCaseResponseDto(caseRecord);
  }

  async deleteCase(id: number): Promise<void> {
    await this.casesRepository.deleteCase(id);
  }
}
