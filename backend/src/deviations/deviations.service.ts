import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VesselsService } from '../vessels/vessels.service';
import { EmissionsService } from '../emissions/emissions.service';
import { Decimal } from 'decimal.js';

type PPSSCPreferenceLine = {
  Traj: string;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
};

type CalculatePPBaselinesArgs = {
  factors: PPSSCPreferenceLine[];
  year: number;
  DWT: Decimal;
};

type PPBaselines = {
  min: Decimal;
  striving: Decimal;
  yxLow: Decimal;
  yxUp: Decimal;
};

@Injectable()
export class DeviationsService {
  constructor(
    private prisma: PrismaService,
    private vesselsService: VesselsService,
    private emissionsService: EmissionsService,
  ) {}

  async calculateVesselDeviations(vesselId: number, year: number) {
    const vessel = await this.vesselsService.findOne(vesselId);
    if (!vessel) {
      throw new Error('Vessel not found');
    }

    // Get PP reference factors for the vessel type
    const ppFactors = await this.prisma.pPSCCReferenceLine.findMany({
      where: {
        vesselTypeId: vessel.vesselType,
        category: 'PP',
      },
    });

    if (!ppFactors.length) {
      throw new Error('PP reference factors not found for vessel type');
    }

    // Get quarter end emissions
    const quarterEndEmissions = await this.emissionsService.findQuarterEndEmissions(vesselId, year);

    const deviations = [];

    for (const { quarter, quarterEnd, emission } of quarterEndEmissions) {
      // Calculate baseline using the utility function
      const baselines = this.calculatePPSCCBaselines({
        factors: ppFactors.map(f => ({
          Traj: f.traj,
          a: f.a.toNumber(),
          b: f.b.toNumber(),
          c: f.c.toNumber(),
          d: f.d.toNumber(),
          e: f.e.toNumber(),
        })),
        year,
        DWT: new Decimal(50000), // Assuming average DWT for vessel type 1001
      });

      // Calculate actual emission (using total CO2 equivalent)
      const actualEmission = emission.totW2wco2;

      // Calculate deviation percentage
      const deviationPercentage = actualEmission
        .minus(baselines.min)
        .dividedBy(baselines.min)
        .mul(100);

      deviations.push({
        vesselId,
        quarter: `${year}-${quarter}`,
        year,
        quarterEnd,
        actualEmission,
        baselineEmission: baselines.min,
        deviationPercentage,
        baselines,
      });

      // Store in database
      await this.prisma.vesselDeviation.upsert({
        where: {
          vesselId_quarter: {
            vesselId,
            quarter: `${year}-${quarter}`,
          },
        },
        update: {
          actualEmission,
          baselineEmission: baselines.min,
          deviationPercentage,
        },
        create: {
          vesselId,
          quarter: `${year}-${quarter}`,
          year,
          quarterEnd,
          actualEmission,
          baselineEmission: baselines.min,
          deviationPercentage,
        },
      });
    }

    return deviations;
  }

  async getVesselDeviations(vesselId: number, year?: number) {
    const where: any = { vesselId };
    if (year) {
      where.year = year;
    }

    return this.prisma.vesselDeviation.findMany({
      where,
      include: {
        vessel: true,
      },
      orderBy: [
        { year: 'asc' },
        { quarter: 'asc' },
      ],
    });
  }

  async getAllDeviations(year?: number) {
    const where: any = {};
    if (year) {
      where.year = year;
    }

    return this.prisma.vesselDeviation.findMany({
      where,
      include: {
        vessel: true,
      },
      orderBy: [
        { vessel: { name: 'asc' } },
        { year: 'asc' },
        { quarter: 'asc' },
      ],
    });
  }

  private calculatePPSCCBaselines({
    factors,
    year,
    DWT,
  }: CalculatePPBaselinesArgs): PPBaselines {
    const { minFactors, strFactors } = factors.reduce<{
      minFactors: PPSSCPreferenceLine;
      strFactors: PPSSCPreferenceLine;
    }>(
      (acc, cur) => {
        const key = (() => {
          switch (cur.Traj?.trim()) {
            case 'MIN':
              return 'minFactors';
            case 'STR':
              return 'strFactors';
            default:
              return null;
          }
        })();

        if (!key) {
          return acc;
        }

        return {
          ...acc,
          [key]: cur,
        };
      },
      { 
        minFactors: { Traj: '', a: 0, b: 0, c: 0, d: 0, e: 0 },
        strFactors: { Traj: '', a: 0, b: 0, c: 0, d: 0, e: 0 }
      },
    );

    const min = this.calculatePPSCCBaseline({ factors: minFactors, year, DWT });
    const striving = this.calculatePPSCCBaseline({ factors: strFactors, year, DWT });

    const yxLowF = 0.33;
    const yxUpF = 1.67;

    const yxLow = min.mul(yxLowF);
    const yxUp = min.mul(yxUpF);

    return {
      min,
      striving,
      yxLow,
      yxUp,
    };
  }

  private calculatePPSCCBaseline({
    factors,
    year,
    DWT,
  }: {
    factors: PPSSCPreferenceLine;
    year: number;
    DWT: Decimal;
  }): Decimal {
    return Decimal.sum(
      Decimal.mul(factors.a || 0, Decimal.pow(year, 3)),
      Decimal.mul(factors.b || 0, Decimal.pow(year, 2)),
      Decimal.mul(factors.c || 0, year),
      factors.d || 0,
    ).mul(Decimal.pow(DWT, factors.e || 0));
  }
} 