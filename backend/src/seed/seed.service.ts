import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async seedAll() {
    console.log('Starting database seeding...');
    
    await this.seedVessels();
    await this.seedPPReference();
    await this.seedEmissions();
    
    console.log('Database seeding completed!');
  }

  private async seedVessels() {
    console.log('Seeding vessels...');
    
    const vesselsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), '..', 'vessels.json'), 'utf8')
    );

    for (const vessel of vesselsData) {
      await this.prisma.vessel.upsert({
        where: { imoNo: vessel.IMONo },
        update: {
          name: vessel.Name,
          vesselType: vessel.VesselType,
        },
        create: {
          name: vessel.Name,
          imoNo: vessel.IMONo,
          vesselType: vessel.VesselType,
        },
      });
    }
    
    console.log(`Seeded ${vesselsData.length} vessels`);
  }

  private async seedPPReference() {
    console.log('Seeding PP reference data...');
    
    const ppData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), '..', 'pp-reference.json'), 'utf8')
    );

    for (const pp of ppData) {
      await this.prisma.pPSCCReferenceLine.upsert({
        where: { id: pp.RowID },
        update: {
          category: pp.Category,
          vesselTypeId: pp.VesselTypeID,
          size: pp.Size,
          traj: pp.Traj,
          a: pp.a,
          b: pp.b,
          c: pp.c,
          d: pp.d,
          e: pp.e,
        },
        create: {
          id: pp.RowID,
          category: pp.Category,
          vesselTypeId: pp.VesselTypeID,
          size: pp.Size,
          traj: pp.Traj,
          a: pp.a,
          b: pp.b,
          c: pp.c,
          d: pp.d,
          e: pp.e,
        },
      });
    }
    
    console.log(`Seeded ${ppData.length} PP reference records`);
  }

  private async seedEmissions() {
    console.log('Seeding emissions data...');
    
    const emissionsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), '..', 'daily-log-emissions.json'), 'utf8')
    );

    // Get all vessels to map IMO numbers to IDs
    const vessels = await this.prisma.vessel.findMany();
    const vesselMap = new Map(vessels.map(v => [v.imoNo, v.id]));

    let count = 0;
    const batchSize = 1000;

    for (let i = 0; i < emissionsData.length; i += batchSize) {
      const batch = emissionsData.slice(i, i + batchSize);
      
      const emissionsToCreate = batch
        .filter(emission => vesselMap.has(emission.VesselID))
        .map(emission => ({
          eid: emission.EID,
          vesselId: vesselMap.get(emission.VesselID),
          logId: emission.LOGID,
          fromUtc: new Date(emission.FromUTC),
          toUtc: new Date(emission.TOUTC),
          met2wco2: emission.MET2WCO2,
          aet2wco2: emission.AET2WCO2,
          bot2wco2: emission.BOT2WCO2,
          vrt2wco2: emission.VRT2WCO2,
          totT2wco2: emission.TotT2WCO2,
          mew2wco2e: emission.MEW2WCO2e,
          aew2wco2e: emission.AEW2WCO2e,
          bow2wco2e: emission.BOW2WCO2e,
          vrw2wco2e: emission.VRW2WCO2e,
          totW2wco2: emission.ToTW2WCO2,
          mesox: emission.MESox,
          aesox: emission.AESox,
          bosox: emission.BOSox,
          vrsox: emission.VRSox,
          totSox: emission.TotSox,
          menox: emission.MENox,
          aenox: emission.AENox,
          bonox: emission.BONox,
          vrnox: emission.VRNox,
          totNox: emission.TotNox,
          mepm: emission.MEPm,
          aepm: emission.AEPm,
          bopm: emission.BOPm,
          vrpm: emission.VRPm,
          totPm: emission.TotPm,
          mech4: emission.MECh4,
          aech4: emission.AECh4,
          boch4: emission.BOCh4,
          vrch4: emission.VRCh4,
          totCh4: emission.TotCh4,
          men2o: emission.MEN2O,
          aen2o: emission.AEN2O,
          bon2o: emission.BON2O,
          vrn2o: emission.VRN2O,
          totN2o: emission.TotN2O,
          mehfc: emission.MEHFC,
          aehfc: emission.AEHFC,
          bohfc: emission.BOHFC,
          vrhfc: emission.VRHFC,
          totHfc: emission.TotHFC,
          mesf6: emission.MESF6,
          aesf6: emission.AESF6,
          bosf6: emission.BOSF6,
          vrsf6: emission.VRSF6,
          totSf6: emission.TotSF6,
          mepfc: emission.MEPFC,
          aepfc: emission.AEPFC,
          bopfc: emission.BOPFC,
          vrpfc: emission.VRPFC,
          totPfc: emission.TotPFC,
        }));

      if (emissionsToCreate.length > 0) {
        await this.prisma.dailyEmission.createMany({
          data: emissionsToCreate,
          skipDuplicates: true,
        });
        count += emissionsToCreate.length;
      }
    }
    
    console.log(`Seeded ${count} emissions records`);
  }
} 