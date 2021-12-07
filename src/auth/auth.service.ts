import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

interface registerInput {
  username: string;
  password?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register({ username, password }: registerInput) {
    const user = await this.isUser(username);
    if (user) throw new UnprocessableEntityException('username is taken');
    const saved: User = await this.userRepo.save(
      this.userRepo.create({
        username,
        password,
      }),
    );
    const payload = { username, id: saved.id };
    return this.login(payload);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    if (pass === 'provider') return null;
    const user = await this.isUser(username);
    if (user && user.password === pass) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async isUser(username: string) {
    const user = await this.userRepo.findOne({ username });
    if (!user) return false;
    return user;
  }

  async login({ username, id }) {
    const isUser = await this.isUser(username);
    if (!isUser) return 'user with this email not found';
    return {
      access_token: this.jwtService.sign({ username, id }),
    };
  }
}
