import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReqUser } from '../../common/constants/constants';
import { SendBatchDto } from './dto/send-batch.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import { BatchEntity } from './entities/batch.entity';
import { type Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';

@Controller('batches')
@UseGuards(AuthorizationGuard)
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('json'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5mb
          new FileTypeValidator({ fileType: 'application/json' }),
        ],
      })
    )
    json: Express.Multer.File,
    @Body() createBatchDto: CreateBatchDto,
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: ReqUser
  ) {
    const { email } = user;
    return this.batchesService.create(createBatchDto, email, json);
  }

  @Get()
  findAll(
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: ReqUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10
  ): Promise<PaginationResponseDto<BatchEntity>> {
    const { email } = user;
    return this.batchesService.findAll(email, page, limit);
  }

  @Get('/inbox')
  inbox(
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: ReqUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10
  ): Promise<PaginationResponseDto<BatchEntity>> {
    const { email } = user;
    return this.batchesService.inbox(email, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.batchesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBatchDto: UpdateBatchDto) {
    return this.batchesService.update(id, updateBatchDto);
  }

  @Patch(':id/accept')
  accept(
    @Param('id') id: string,
    @Body() updateBatchDto: UpdateBatchDto,
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: ReqUser
  ) {
    const { email } = user;
    return this.batchesService.accept(id, updateBatchDto, email);
  }

  @Patch(':id/send')
  send(
    @Param('id') id: string,
    @Body() sendBatchDto: SendBatchDto,
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: ReqUser
  ) {
    const { email } = user;
    return this.batchesService.send(id, sendBatchDto, email);
  }

  @Patch(':id/decline')
  decline(@Param('id') id: string, @Body() updateBatchDto: UpdateBatchDto) {
    return this.batchesService.decline(id, updateBatchDto);
  }

  @Patch(':id/reclaim')
  reclaim(@Param('id') id: string, @Body() updateBatchDto: UpdateBatchDto) {
    return this.batchesService.reclaim(id, updateBatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batchesService.remove(id);
  }
}
