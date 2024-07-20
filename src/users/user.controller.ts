import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserManager } from '../services/user_manager';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userManager: UserManager,
  ) {}

  @Post('/createUser')
  create(@Body() user: User) {
    try {
      return this.userManager.createUser(user);
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  @Get('/findByOrganization')
  findByOrganization(@Param('organizationId') organizationId: string) {
    return this.userManager.getOrganizationUsers(organizationId);
  }
  @Get('/findAll')
  findAll() {
    return this.userManager.getAllUsers();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: User) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
