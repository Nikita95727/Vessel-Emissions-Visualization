import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function importData() {
  try {
    console.log('Starting data import...');

    // Read JSON files
    const vesselsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../vessels.json'), 'utf8'));
    const ppReferenceData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../pp-reference.json'), 'utf8'));
    const emissionsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../daily-log-emissions.json'), 'utf8'));

    console.log(`Found ${vesselsData.length} vessels`);
    console.log(`Found ${ppReferenceData.length} PP reference entries`);
    console.log(`Found ${emissionsData.length} emissions records`);

    // Import vessels
    console.log('Importing vessels...');
    for (const vessel of vesselsData) {
      await prisma.vessel.upsert({
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
    console.log('Vessels imported successfully');

    // Import PP reference data
    console.log('Importing PP reference data...');
    for (const ref of ppReferenceData) {
      await prisma.pPSCCReferenceLine.upsert({
        where: { id: ref.RowID },
        update: {
          category: ref.Category,
          vesselTypeId: ref.VesselTypeID,
          size: ref.Size.trim(),
          traj: ref.Traj.trim(),
          a: ref.a,
          b: ref.b,
          c: ref.c,
          d: ref.d,
          e: ref.e,
        },
        create: {
          id: ref.RowID,
          category: ref.Category,
          vesselTypeId: ref.VesselTypeID,
          size: ref.Size.trim(),
          traj: ref.Traj.trim(),
          a: ref.a,
          b: ref.b,
          c: ref.c,
          d: ref.d,
          e: ref.e,
        },
      });
    }
    console.log('PP reference data imported successfully');

    // Import emissions data
    console.log('Importing emissions data...');
    let importedCount = 0;
    const batchSize = 1000;

    for (let i = 0; i < emissionsData.length; i += batchSize) {
      const batch = emissionsData.slice(i, i + batchSize);
      
      for (const emission of batch) {
        try {
          // Find the vessel by IMO number
          const vessel = await prisma.vessel.findUnique({
            where: { imoNo: emission.VesselID },
          });

          if (!vessel) {
            console.warn(`Vessel with IMO ${emission.VesselID} not found, skipping emission record`);
            continue;
          }

          await prisma.dailyEmission.upsert({
            where: { eid: emission.EID },
            update: {
              vesselId: vessel.id,
              logId: BigInt(emission.LOGID),
              fromUtc: new Date(emission.FromUTC),
              toUtc: new Date(emission.TOUTC),
              met2wco2: emission.MET2WCO2 || 0,
              aet2wco2: emission.AET2WCO2 || 0,
              bot2wco2: emission.BOT2WCO2 || 0,
              vrt2wco2: emission.VRT2WCO2 || 0,
              totT2wco2: emission.TotT2WCO2 || 0,
              mew2wco2e: emission.MEW2WCO2e || 0,
              aew2wco2e: emission.AEW2WCO2e || 0,
              bow2wco2e: emission.BOW2WCO2e || 0,
              vrw2wco2e: emission.VRW2WCO2e || 0,
              totW2wco2: emission.ToTW2WCO2 || 0,
              mesox: emission.MESox || 0,
              aesox: emission.AESox || 0,
              bosox: emission.BOSox || 0,
              vrsox: emission.VRSox || 0,
              totSox: emission.TotSOx || 0,
              menox: emission.MENOx || 0,
              aenox: emission.AENOx || 0,
              bonox: emission.BONOx || 0,
              vrnox: emission.VRNOx || 0,
              totNox: emission.TotNOx || 0,
              mepm: emission.MEPM10 || 0,
              aepm: emission.AEPM10 || 0,
              bopm: emission.BOPM10 || 0,
              vrpm: emission.VRPM10 || 0,
              totPm: emission.TotPM10 || 0,
              mech4: emission.MECh4 || 0,
              aech4: emission.AECh4 || 0,
              boch4: emission.BOCh4 || 0,
              vrch4: emission.VRCh4 || 0,
              totCh4: emission.TotCh4 || 0,
              men2o: emission.MEN2O || 0,
              aen2o: emission.AEN2O || 0,
              bon2o: emission.BON2O || 0,
              vrn2o: emission.VRN2O || 0,
              totN2o: emission.TotN2O || 0,
              mehfc: emission.MEHFC || 0,
              aehfc: emission.AEHFC || 0,
              bohfc: emission.BOHFC || 0,
              vrhfc: emission.VRHFC || 0,
              totHfc: emission.TotHFC || 0,
              mesf6: emission.MESF6 || 0,
              aesf6: emission.AESF6 || 0,
              bosf6: emission.BOSF6 || 0,
              vrsf6: emission.VRSF6 || 0,
              totSf6: emission.TotSF6 || 0,
              mepfc: emission.MEPFC || 0,
              aepfc: emission.AEPFC || 0,
              bopfc: emission.BOPFC || 0,
              vrpfc: emission.VRPFC || 0,
              totPfc: emission.TotPFC || 0,
            },
            create: {
              eid: emission.EID,
              vesselId: vessel.id,
              logId: BigInt(emission.LOGID),
              fromUtc: new Date(emission.FromUTC),
              toUtc: new Date(emission.TOUTC),
              met2wco2: emission.MET2WCO2 || 0,
              aet2wco2: emission.AET2WCO2 || 0,
              bot2wco2: emission.BOT2WCO2 || 0,
              vrt2wco2: emission.VRT2WCO2 || 0,
              totT2wco2: emission.TotT2WCO2 || 0,
              mew2wco2e: emission.MEW2WCO2e || 0,
              aew2wco2e: emission.AEW2WCO2e || 0,
              bow2wco2e: emission.BOW2WCO2e || 0,
              vrw2wco2e: emission.VRW2WCO2e || 0,
              totW2wco2: emission.ToTW2WCO2 || 0,
              mesox: emission.MESox || 0,
              aesox: emission.AESox || 0,
              bosox: emission.BOSox || 0,
              vrsox: emission.VRSox || 0,
              totSox: emission.TotSOx || 0,
              menox: emission.MENOx || 0,
              aenox: emission.AENOx || 0,
              bonox: emission.BONOx || 0,
              vrnox: emission.VRNOx || 0,
              totNox: emission.TotNOx || 0,
              mepm: emission.MEPM10 || 0,
              aepm: emission.AEPM10 || 0,
              bopm: emission.BOPM10 || 0,
              vrpm: emission.VRPM10 || 0,
              totPm: emission.TotPM10 || 0,
              mech4: emission.MECh4 || 0,
              aech4: emission.AECh4 || 0,
              boch4: emission.BOCh4 || 0,
              vrch4: emission.VRCh4 || 0,
              totCh4: emission.TotCh4 || 0,
              men2o: emission.MEN2O || 0,
              aen2o: emission.AEN2O || 0,
              bon2o: emission.BON2O || 0,
              vrn2o: emission.VRN2O || 0,
              totN2o: emission.TotN2O || 0,
              mehfc: emission.MEHFC || 0,
              aehfc: emission.AEHFC || 0,
              bohfc: emission.BOHFC || 0,
              vrhfc: emission.VRHFC || 0,
              totHfc: emission.TotHFC || 0,
              mesf6: emission.MESF6 || 0,
              aesf6: emission.AESF6 || 0,
              bosf6: emission.BOSF6 || 0,
              vrsf6: emission.VRSF6 || 0,
              totSf6: emission.TotSF6 || 0,
              mepfc: emission.MEPFC || 0,
              aepfc: emission.AEPFC || 0,
              bopfc: emission.BOPFC || 0,
              vrpfc: emission.VRPFC || 0,
              totPfc: emission.TotPFC || 0,
            },
          });
          importedCount++;
        } catch (error) {
          console.error(`Error importing emission record ${emission.EID}:`, error);
        }
      }

      if (i % 10000 === 0) {
        console.log(`Processed ${i} emissions records...`);
      }
    }

    console.log(`Emissions import completed. Imported ${importedCount} records`);

    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error during data import:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importData()
  .then(() => {
    console.log('Import script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import script failed:', error);
    process.exit(1);
  }); 