// src/auth/strategies/jwt.strategy.ts
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { JwtPayload } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET", "change_me"),
    });
  }

  async validate(payload: JwtPayload) {
    // Lo que devuelvas aquí se inyecta en req.user
    return {
      userId: payload.sub,
      clientId: payload.clientId,
      email: payload.email,
      role: payload.role,
    };
  }
}
