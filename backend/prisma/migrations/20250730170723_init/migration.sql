-- CreateTable
CREATE TABLE "public"."vessels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imo_no" INTEGER NOT NULL,
    "vessel_type" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vessels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."daily_emissions" (
    "id" SERIAL NOT NULL,
    "eid" INTEGER NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "log_id" BIGINT NOT NULL,
    "from_utc" TIMESTAMP(3) NOT NULL,
    "to_utc" TIMESTAMP(3) NOT NULL,
    "met2wco2" DECIMAL(10,4) NOT NULL,
    "aet2wco2" DECIMAL(10,4) NOT NULL,
    "bot2wco2" DECIMAL(10,4) NOT NULL,
    "vrt2wco2" DECIMAL(10,4) NOT NULL,
    "totT2wco2" DECIMAL(10,4) NOT NULL,
    "mew2wco2e" DECIMAL(10,4) NOT NULL,
    "aew2wco2e" DECIMAL(10,4) NOT NULL,
    "bow2wco2e" DECIMAL(10,4) NOT NULL,
    "vrw2wco2e" DECIMAL(10,4) NOT NULL,
    "totW2wco2" DECIMAL(10,4) NOT NULL,
    "mesox" DECIMAL(10,4) NOT NULL,
    "aesox" DECIMAL(10,4) NOT NULL,
    "bosox" DECIMAL(10,4) NOT NULL,
    "vrsox" DECIMAL(10,4) NOT NULL,
    "totSox" DECIMAL(10,4) NOT NULL,
    "menox" DECIMAL(10,4) NOT NULL,
    "aenox" DECIMAL(10,4) NOT NULL,
    "bonox" DECIMAL(10,4) NOT NULL,
    "vrnox" DECIMAL(10,4) NOT NULL,
    "totNox" DECIMAL(10,4) NOT NULL,
    "mepm" DECIMAL(10,4) NOT NULL,
    "aepm" DECIMAL(10,4) NOT NULL,
    "bopm" DECIMAL(10,4) NOT NULL,
    "vrpm" DECIMAL(10,4) NOT NULL,
    "totPm" DECIMAL(10,4) NOT NULL,
    "mech4" DECIMAL(10,4) NOT NULL,
    "aech4" DECIMAL(10,4) NOT NULL,
    "boch4" DECIMAL(10,4) NOT NULL,
    "vrch4" DECIMAL(10,4) NOT NULL,
    "totCh4" DECIMAL(10,4) NOT NULL,
    "men2o" DECIMAL(10,4) NOT NULL,
    "aen2o" DECIMAL(10,4) NOT NULL,
    "bon2o" DECIMAL(10,4) NOT NULL,
    "vrn2o" DECIMAL(10,4) NOT NULL,
    "totN2o" DECIMAL(10,4) NOT NULL,
    "mehfc" DECIMAL(10,4) NOT NULL,
    "aehfc" DECIMAL(10,4) NOT NULL,
    "bohfc" DECIMAL(10,4) NOT NULL,
    "vrhfc" DECIMAL(10,4) NOT NULL,
    "totHfc" DECIMAL(10,4) NOT NULL,
    "mesf6" DECIMAL(10,4) NOT NULL,
    "aesf6" DECIMAL(10,4) NOT NULL,
    "bosf6" DECIMAL(10,4) NOT NULL,
    "vrsf6" DECIMAL(10,4) NOT NULL,
    "totSf6" DECIMAL(10,4) NOT NULL,
    "mepfc" DECIMAL(10,4) NOT NULL,
    "aepfc" DECIMAL(10,4) NOT NULL,
    "bopfc" DECIMAL(10,4) NOT NULL,
    "vrpfc" DECIMAL(10,4) NOT NULL,
    "totPfc" DECIMAL(10,4) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_emissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pp_scc_reference_lines" (
    "row_id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "vessel_type_id" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "traj" TEXT NOT NULL,
    "a" DECIMAL(20,12) NOT NULL,
    "b" DECIMAL(20,12) NOT NULL,
    "c" DECIMAL(20,12) NOT NULL,
    "d" DECIMAL(20,12) NOT NULL,
    "e" DECIMAL(20,12) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pp_scc_reference_lines_pkey" PRIMARY KEY ("row_id")
);

-- CreateTable
CREATE TABLE "public"."vessel_deviations" (
    "id" SERIAL NOT NULL,
    "vessel_id" INTEGER NOT NULL,
    "quarter" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "quarter_end" TIMESTAMP(3) NOT NULL,
    "actual_emission" DECIMAL(10,4) NOT NULL,
    "baseline_emission" DECIMAL(10,4) NOT NULL,
    "deviation_percentage" DECIMAL(10,4) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vessel_deviations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vessels_imo_no_key" ON "public"."vessels"("imo_no");

-- CreateIndex
CREATE UNIQUE INDEX "daily_emissions_eid_key" ON "public"."daily_emissions"("eid");

-- CreateIndex
CREATE UNIQUE INDEX "vessel_deviations_vessel_id_quarter_key" ON "public"."vessel_deviations"("vessel_id", "quarter");

-- AddForeignKey
ALTER TABLE "public"."daily_emissions" ADD CONSTRAINT "daily_emissions_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "public"."vessels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vessel_deviations" ADD CONSTRAINT "vessel_deviations_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "public"."vessels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
