import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDTO } from './dtos/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
  ) {}

  create(reportDtO: CreateReportDTO, user: User) {
    const report = this.reportRepository.create(reportDtO);
    report.user = user;
    return this.reportRepository.save(report);
  }

  async updateApproved(id: number, approved: boolean) {
    const report = await this.findOne(id);
    if (!report) {
      throw new NotFoundException('report not found');
    }
    report.approved = approved;
    return this.reportRepository.save(report);
  }

  async findOne(id: number) {
    if (!id) {
      throw new NotFoundException('report not found');
    }
    return await this.reportRepository.findOne({
      where: { id },
    });
  }
}
