import {
  Controller,
  Get,
  Query,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdateAllergyDto } from './dto/update-allergy.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('allergies')
export class AllergyController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @Roles('admin', 'doctor')
  async getAllAllergies(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('keyword') keyword?: string,
  ) {
    return this.patientService.getAllAllergies(page, pageSize, keyword);
  }

  @Get(':id')
  @Roles('admin', 'doctor')
  async getAllergyById(@Param('id') id: string) {
    const allergy = (this.patientService as any).mockAllergies.find(
      (a: any) => a.id === id,
    );
    if (!allergy) {
      throw new Error('过敏记录不存在');
    }
    return allergy;
  }

  @Post()
  @Roles('admin')
  async createAllergy(@Body() dto: CreateAllergyDto) {
    if (!dto.patientId) {
      throw new Error('patientId 不能为空');
    }
    return this.patientService.createAllergy(dto.patientId, dto);
  }

  @Put(':id')
  @Roles('admin')
  async updateAllergy(
    @Param('id') id: string,
    @Body() dto: UpdateAllergyDto,
  ) {
    const allergies = (this.patientService as any).mockAllergies;
    const index = allergies.findIndex((a: any) => a.id === id);
    if (index === -1) {
      throw new Error('过敏记录不存在');
    }
    allergies[index] = { ...allergies[index], ...dto };
    return allergies[index];
  }

  @Delete(':id')
  @Roles('admin')
  async deleteAllergy(@Param('id') id: string) {
    const allergies = (this.patientService as any).mockAllergies;
    const index = allergies.findIndex((a: any) => a.id === id);
    if (index === -1) {
      throw new Error('过敏记录不存在');
    }
    allergies.splice(index, 1);
    return { success: true };
  }
}
