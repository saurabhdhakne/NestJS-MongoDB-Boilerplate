
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
    
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  @Transform((o)=>o.value?.trim())
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @Transform((o)=>o.value?.trim())
  firstName: string;
  
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @Transform((o)=>o.value?.trim())
  lastName: string;

  @ApiProperty({ required: true })
  @IsString()
  @Transform((o)=>o.value?.trim())
  mode: string;
}