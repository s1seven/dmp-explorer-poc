import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator';
import { TokenUserDto } from '../../common/dto/token-user';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Post User',
    type: () => TokenUserDto,
    isArray: false,
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Get by id',
  //   type: () => ReturnUserDto,
  //   isArray: false,
  // })
  // @UseGuards(AuthGuard('jwt'))
  // @Get(':id')
  // findOneById(
  //   @Param('id', ParseIntPipe) id: string,
  //   @CurrentUser() user: ReqUser
  // ): Promise<ReturnUserDto> {
  //   return this.usersService.findOneById(id, user);
  // }

  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Delete',
  //   type: () => UserEntity,
  //   isArray: false,
  // })
  // @UseGuards(AuthGuard('jwt'))
  // @Delete(':id')
  // remove(
  //   @Param('id', ParseIntPipe) id: string,
  //   @CurrentUser() user: ReqUser
  // ): Promise<ReturnUserDto> {
  //   return this.usersService.remove(id, user);
  // }
}
