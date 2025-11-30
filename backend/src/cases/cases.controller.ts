import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { CaseResponseDto } from './dto/case-response.dto';

@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  createCase(@Body() createCaseDto: CreateCaseDto): Promise<CaseResponseDto> {
    return this.casesService.createCase(createCaseDto);
  }

  @Get()
  listCases(): Promise<CaseResponseDto[]> {
    return this.casesService.listCases();
  }

  @Get(':id')
  getCase(@Param('id', ParseIntPipe) id: number): Promise<CaseResponseDto> {
    return this.casesService.getCase(id);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteCase(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.casesService.deleteCase(id);
  }
}
