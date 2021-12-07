import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 15)
  username: string = null;

  @IsString()
  @Length(6, 16)
  password: string = null;
}
