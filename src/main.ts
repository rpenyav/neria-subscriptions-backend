// src/main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS para que el frontend (React/Vite) pueda llamar
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no esperadas
      forbidNonWhitelisted: true,
      transform: true, // transforma tipos (string -> number, etc.)
    })
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  // console.log(`Neria Subscriptions API running on http://localhost:${port}`);
}

bootstrap();
