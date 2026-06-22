import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './config/configuration';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { PatientModule } from './modules/patient/patient.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { ConsultationModule } from './modules/consultation/consultation.module';
import { MessageModule } from './modules/message/message.module';
import { UploadModule } from './modules/upload/upload.module';
import { RedisService } from './utils/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    AuthModule,
    PatientModule,
    DoctorModule,
    ConsultationModule,
    MessageModule,
    UploadModule,
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class AppModule {}
