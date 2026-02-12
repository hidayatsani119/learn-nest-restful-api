import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 255)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  password: string;
}
