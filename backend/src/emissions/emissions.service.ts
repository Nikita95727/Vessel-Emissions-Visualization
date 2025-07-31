import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmissionsService {
  constructor(private prisma: PrismaService) {}

  async findByVessel(vesselId: number, limit?: number) {
    return this.prisma.dailyEmission.findMany({
      where: { vesselId },
      orderBy: { toUtc: 'desc' },
      take: limit || 100,
    });
  }

  async findQuarterEndEmissions(vesselId: number, year: number) {
    const quarters = [
      { quarter: 'Q1', endMonth: 3, endDay: 31 },
      { quarter: 'Q2', endMonth: 6, endDay: 30 },
      { quarter: 'Q3', endMonth: 9, endDay: 30 },
      { quarter: 'Q4', endMonth: 12, endDay: 31 },
    ];

    const quarterEndEmissions = [];

    for (const { quarter, endMonth, endDay } of quarters) {
      const quarterEndDate = new Date(year, endMonth - 1, endDay);
      
      // Find the closest emission record to the quarter end date
      const emission = await this.prisma.dailyEmission.findFirst({
        where: {
          vesselId,
          toUtc: {
            lte: quarterEndDate,
          },
        },
        orderBy: {
          toUtc: 'desc',
        },
      });

      if (emission) {
        quarterEndEmissions.push({
          quarter,
          year,
          quarterEnd: quarterEndDate,
          emission,
        });
      }
    }

    return quarterEndEmissions;
  }
} 