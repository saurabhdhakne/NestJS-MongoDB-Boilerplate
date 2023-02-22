import { ValidationError, ValidationPipe, VersioningType, INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';
import { ValidationException } from './exceptions/validation.exception';
import { ValidationFilter } from './exceptions/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({                                          // By calling app.enableCors(), NestJS adds the necessary CORS headers to the response to allow cross-origin requests.
    origin: process.env.CORS_ORIGINS?.split(',') ?? '*',    // string/[string], The origin parameter is used to specify which origins are allowed to make cross-origin requests
    preflightContinue: false,                               // If preflightContinue is set to true, NestJS will continue processing the original request even if the preflight request fails. If it's set to false, the server will respond with an error if the preflight request fails.
    maxAge: 300,                                            // The maxAge parameter is used to specify how long the CORS headers should be cached by the browser. 
  });
  app.enableShutdownHooks();                                // perform any necessary cleanup actions before exiting.
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      skipMissingProperties: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map(
          (err) => `${err.property} has wrong value ${err.value}`,
        );
        return new ValidationException(messages);
      },
    }),
  );
  await attachOpenAPIDocumentation(app);
  await app.listen(process.env.PORT ? process.env.PORT : 4000);
}

async function attachOpenAPIDocumentation(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE)
    .setDescription(process.env.SWAGGER_DESCRIPTION)
    .setVersion(process.env.SWAGGER_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
bootstrap();
  