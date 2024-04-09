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

@Controller('batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @UseGuards(AuthorizationGuard)
  @Post()
  create(
    @Body() createBatchDto: CreateBatchDto,
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: {
      email: string;
    }
  ) {
    const { email } = user;
    return this.batchesService.create(createBatchDto, email);
  }

  @UseGuards(AuthorizationGuard)
  @Get()
  findAll(
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: {
      email: string;
    }
  ) {
    const { email } = user;
    return this.batchesService.findAll(email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.batchesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBatchDto: UpdateBatchDto) {
    return this.batchesService.update(+id, updateBatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batchesService.remove(+id);
  }
}
