// src/app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

// Módulos de dominio
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ClientsModule } from "./clients/clients.module";
import { PlansModule } from "./plans/plans.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import { ApiKeysModule } from "./api-keys/api-keys.module";
import { BillingModule } from "./billing/billing.module";

@Module({
  imports: [
    // 1) Config global (lee .env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2) TypeORM con ConfigService inyectado correctamente
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // importante para poder inyectar ConfigService
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get<string>("DB_HOST", "localhost"),
        port: parseInt(configService.get<string>("DB_PORT", "3306"), 10),
        username: configService.get<string>("DB_USER", "root"),
        password: configService.get<string>("DB_PASSWORD", ""),
        database: configService.get<string>("DB_NAME", "neria_subscriptions"),
        autoLoadEntities: true,
        synchronize: true, // en dev ok; en prod luego lo pondremos a false
      }),
    }),

    // 3) Resto de módulos
    AuthModule,
    UsersModule,
    ClientsModule,
    PlansModule,
    SubscriptionsModule,
    ApiKeysModule,
    BillingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
