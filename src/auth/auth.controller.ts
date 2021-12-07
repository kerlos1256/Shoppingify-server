import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { validateBodyPipe } from 'src/utils/validateBody.pipe';
import { AuthService } from './auth.service';

import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req) {
    const payload = { username: req.user.username, id: req.user.id };
    return this.authService.login(payload);
  }
  @Post('register')
  @UsePipes(new validateBodyPipe(CreateUserDto))
  register(@Body() { username, password }: CreateUserDto) {
    return this.authService.register({
      username,
      password,
    });
  }
}
