import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto) //applied serializer to all routes in this entire controller
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.authService.signUp(body.email, body.password);
  }

  @Post('/signin')
  signIn(@Body() body: CreateUserDto) {
    return this.authService.signIn(body.email, body.password);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get('')
  async findAllUsers(@Query('email') email: string) {
    const user = await this.userService.find(email);
    if (!user) {
      return new NotFoundException('USER NOT FOUND');
    }
    return user;
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }
}
