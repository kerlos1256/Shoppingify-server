import { IsNumber, IsString, Length } from 'class-validator';

export class CreateListDto {
  @IsString()
  @Length(2, 15)
  listName: string = null;
}
