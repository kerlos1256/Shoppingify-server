import { Strategy, IStrategyOptionsWithRequest } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user: User = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('wrong username or password');
    }
    return user;
  }
}
