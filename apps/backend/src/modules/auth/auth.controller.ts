// Diseñado por: Edward Labrador
// Para Unión de Comerciantes del Estado Zulia
// Versión: 1.0.0
// Todos los Derechos Reservados UCEZ 2026

import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  register(@Body() dto: { email: string; password: string; name: string; role?: string }) {
    return this.authService.register(dto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Iniciar sesión' })
  login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Renovar token de acceso' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Cerrar sesión' })
  logout(@Request() req: any) {
    return this.authService.logout(req.user.sub);
  }
}
