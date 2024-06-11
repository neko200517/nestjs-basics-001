import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppDataSource } from './data-source';
import { ItemRepository } from './items/item.repository';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await AppDataSource.initialize();
  await app.listen(3000);
}
bootstrap();
