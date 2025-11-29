// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import type { User } from "../users/entities/user.entity";

export interface JwtPayload {
  sub: number; // userId
  clientId: number;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  private async validateUser(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const payload: JwtPayload = {
      sub: user.id,
      clientId: user.clientId,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        clientId: user.clientId,
        client: user.client
          ? {
              id: user.client.id,
              name: user.client.name,
              slug: user.client.slug,
              status: user.client.status,
            }
          : null,
      },
    };
  }
}
