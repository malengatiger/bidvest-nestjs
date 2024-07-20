import { Injectable } from '@nestjs/common';
import { UserManager } from 'src/services/user_manager';

@Injectable()
export class UserService {
  constructor(private readonly userService: UserManager) {
    
  }
  create(createUser: User) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: User) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
