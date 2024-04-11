import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CompanyEntity } from './entities/company.entity';
import { ReqUser } from '../../common/constants/constants';

@Controller('companies')
@UseGuards(AuthorizationGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: ReqUser
  ) {
    const { email } = user;
    return this.companiesService.create(createCompanyDto, email);
  }

  @Get()
  findAll(
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: ReqUser
  ): Promise<CompanyEntity[]> {
    const { email } = user;
    return this.companiesService.findAll(email);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser(new ValidationPipe({ validateCustomDecorators: true }))
    user: ReqUser
  ) {
    const { email } = user;
    return this.companiesService.findOne(email, id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
  //   return this.companiesService.update(+id, updateCompanyDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.companiesService.remove(+id);
  // }
}
