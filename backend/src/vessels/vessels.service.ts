import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VesselsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.vessel.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.vessel.findUnique({
      where: { id },
      include: {
        emissions: {
          orderBy: { toUtc: 'desc' },
          take: 10,
        },
      },
    });
  }

  async findByImo(imoNo: number) {
    return this.prisma.vessel.findUnique({
      where: { imoNo },
    });
  }
} 