import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend integration
  app.enableCors();

  // Enable global validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Strips unknown properties
      forbidNonWhitelisted: true, // Throws error if unknown values are present
      transform: true,        // Automatically transform payloads to DTO classes
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Collaborative ToDo App API')
    .setDescription('API documentation for the collaborative ToDo project')
    .setVersion('1.0')
    .addBearerAuth() // Enable JWT auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Accessible at http://localhost:3000/api

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  Logger.log(`🚀 Application is running on http://localhost:${port}`);
  Logger.log(`📘 Swagger Docs available at http://localhost:${port}/api`);
}

bootstrap();
