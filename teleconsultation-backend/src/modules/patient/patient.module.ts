import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { MedicalRecordController } from './medical-record.controller';
import { ExaminationReportController } from './examination-report.controller';
import { AllergyController } from './allergy.controller';

@Module({
  controllers: [
    PatientController,
    MedicalRecordController,
    ExaminationReportController,
    AllergyController,
  ],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
