import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guards';
import { CreateReportDTO } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';

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
  async approveReport(@Param('id') id: string, @Body() body: UpdateReportDto) {
    const report = await this.reportsService.updateApproved(
      parseInt(id),
      body.approved,
    );
    return report;
  }

  @Get('/:id')
  // @Serialize(ReportDto) //applied serializer to all routes in this entire controller
  async getReport(@Param('id') id: string) {
    const report = await this.reportsService.findOne(parseInt(id));
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }
}
