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
} from '@nestjs/common';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReqUser } from '../../common/constants/constants';
import { SendBatchDto } from './dto/send-batch.dto';

@Controller('batches')
@UseGuards(AuthorizationGuard)
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Post()
  create(
    @Body() createBatchDto: CreateBatchDto,
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: ReqUser
  ) {
    const { email } = user;
    return this.batchesService.create(createBatchDto, email);
  }

  @Get()
  findAll(
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: ReqUser
  ) {
    const { email } = user;
    return this.batchesService.findAll(email);
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
  send(@Param('id') id: string, @Body() sendBatchDto: SendBatchDto) {
    return this.batchesService.send(id, sendBatchDto);
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
