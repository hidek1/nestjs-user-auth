import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    this.userService.add(createUserDto);
  }

  @Get(':token')
  async getUserInfoByToken(@Param() params) {
    console.log(params.token);
    return this.userService.findByToken(params.token);
  }

  @Get('token')
  async createToken(): Promise<any> {
    return await this.userService.createToken();
  }

  // @Get('data')
  // @UseGuards(AuthGuard())
  // findAll() {
  //   // this route is restricted by AuthGuard
  //   // JWT strategy
  //   return "passed";
  // }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.logIn(loginDto)
  }
}
