import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const userExists = await this.usersService.findUserByEmail(createUserDto.email);

      if (userExists) {
        throw new BadRequestException(`User already exist with email ${createUserDto.email}.`);
      }
      return this.usersService.create(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  findAll(): Promise<User[]> {
    try {
      return this.usersService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string):Promise<User> {
    try{
      return this.usersService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto):Promise<User> {
    try{
      return this.usersService.update(+id, updateUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string):Promise<void> {
    try{
      return this.usersService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
  
}
