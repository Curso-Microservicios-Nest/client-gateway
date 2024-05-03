import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { config } from 'src/config/config';

async function bootstrap() {
  const logger = new Logger('MainGateway');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const documentBuilder = new DocumentBuilder()
    .setTitle('Client Gateway')
    .setDescription('The Client Gateway for microservices')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.port);
  logger.log(`🚀 Main Gateway running on PORT: ${config.port}`);
}
bootstrap();
