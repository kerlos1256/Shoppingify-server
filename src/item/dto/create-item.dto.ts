import { IsNumber, IsString, Length } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsString()
  @Length(2, 50)
  category: string;
}
