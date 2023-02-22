import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async create(createUserDto: CreateUserDto):Promise<User> {
    try{
      const createdUser = new this.userModel(createUserDto);
      return createdUser.save();
    }catch (error) {
      throw new InternalServerErrorException  (error);
    }
  }

  async findAll(): Promise<User[]> {
    try{
      const users = await this.userModel.find().exec();
      return users;
    }catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<User>  {
    try{
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    }catch (error) {
      throw new InternalServerErrorException  (error);
    }
  }

  findUserByEmail(email: string): Promise<User>  {
    try{
      return this.userModel.findOne({email}).exec();
    }catch (error) {
      throw new InternalServerErrorException  (error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User>  {
    try{
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        { new: true },
      ).exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return updatedUser;
    }catch (error) {
      throw new InternalServerErrorException  (error);
    }
  }

  async remove(id: number): Promise<void> {
    try{
      const result = await this.userModel.deleteOne({ _id: id }).exec();

      if (result.deletedCount === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    }catch (error) {
      throw new InternalServerErrorException  (error);
    }
  }

}
