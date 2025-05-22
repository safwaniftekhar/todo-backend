import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        
      forbidNonWhitelisted: true,
      transform: true,        
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Collaborative ToDo App API')
    .setDescription('API documentation for the collaborative ToDo project')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  Logger.log(`🚀 Application is running on http://localhost:${port}`);
  Logger.log(`📘 Swagger Docs available at http://localhost:${port}/api`);
}

bootstrap();
