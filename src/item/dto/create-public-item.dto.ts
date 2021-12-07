import { IsString, Length } from 'class-validator';

export class CreatePublicItemDto {
  @IsString()
  @Length(2, 50)
  name: string;
  @IsString()
  @Length(3, 50)
  category: string;
}
