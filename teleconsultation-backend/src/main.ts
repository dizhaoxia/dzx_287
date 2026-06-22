import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  
  app.enableCors();
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 30402;
  
  await app.listen(port);
  console.log(`Teleconsultation backend is running on port ${port}`);
}

bootstrap();
