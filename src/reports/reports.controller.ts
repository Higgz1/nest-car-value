import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guards';
import { CreateReportDTO } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto) //applied serializer to all routes in this entire controller
  async createReport(@Body() body: CreateReportDTO, @CurrentUser() user: User) {
    const report = await this.reportsService.create(body, user);
    return report;
  }
}
