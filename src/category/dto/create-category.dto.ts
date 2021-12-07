import { IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(3, 10)
  name: string;
}
