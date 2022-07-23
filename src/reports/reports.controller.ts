import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guards';
import { CreateReportDTO } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';
import { AdminGuard } from '../guards/admin.guard';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @Serialize(ReportDto) //applied serializer to all routes in this entire controller
  @UseGuards(AuthGuard)
  async createReport(@Body() body: CreateReportDTO, @CurrentUser() user: User) {
    const report = await this.reportsService.create(body, user);
    return report;
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async approveReport(@Param('id') id: string, @Body() body: UpdateReportDto) {
    const report = await this.reportsService.updateApproved(
      parseInt(id),
      body.approved,
    );
    return report;
  }

  @Get('')
  async getEstimate(@Query() query: GetEstimateDto) {
    return await this.reportsService.getEstimate(query);
  }
}
