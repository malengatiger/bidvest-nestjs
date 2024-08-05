import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserManager } from "../services/user_manager";
import { User } from "src/models/models";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userManager: UserManager
  ) {}

  @Post("/createUser")
  create(@Body() user: User) {
    try {
      return this.userManager.createUser(user, 'Users');
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  @Get("/findByOrganization")
  async findByOrganization(@Query("organizationId") organizationId: string) {
    try {
      return await this.userManager.getOrganizationUsers(organizationId);
    } catch (error) {
      throw new HttpException(`Failed to get organization users: ${error}`, HttpStatus.BAD_REQUEST);
    }
  }
  @Get("/findAll")
  findAll() {
    return this.userManager.getAllUsers();
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: User) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
