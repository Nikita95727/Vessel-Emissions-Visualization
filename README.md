# Vessel Emissions Visualization

A full-stack application for visualizing vessel emissions data and calculating deviations from Poseidon Principles baselines. Built with NextJS, NestJS, PostgreSQL, and Prisma.

## Features

- **Database Management**: PostgreSQL with Prisma ORM for efficient data handling
- **Data Import**: Automated import of vessel, emissions, and reference data from JSON files
- **Deviation Calculation**: Automatic calculation of percentage deviations from Poseidon Principles minimum baselines
- **Interactive Visualization**: Highcharts-powered charts showing quarterly deviation data
- **Multi-Vessel Support**: View and compare emissions data across multiple vessels
- **Quarter-End Analysis**: Focus on quarter-end emissions data for compliance reporting
- **Real-time Data Processing**: Batch processing of large emissions datasets

## Project Structure

```
vlad_test/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── vessels/         # Vessel management
│   │   ├── emissions/       # Emissions data handling
│   │   ├── deviations/      # Deviation calculation logic
│   │   ├── seed/           # Database seeding
│   │   └── prisma/         # Database configuration
│   ├── scripts/
│   │   └── import-data.ts  # Data import script
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── src/                    # NextJS frontend application
│   ├── app/               # NextJS app directory
│   ├── components/        # React components
│   └── globals.css
├── vessels.json           # Vessel data
├── daily-log-emissions.json # Emissions data (1.4MB)
├── pp-reference.json      # Poseidon Principles reference data
├── calculate-pp-scc-baselines.util.ts # Baseline calculation utility
├── package.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Setup Instructions

### 1. Database Setup

1. **Install PostgreSQL** (if not already installed)
   - Download from [PostgreSQL official website](https://www.postgresql.org/download/)
   - Create a database named `vessel_emissions`

2. **Configure Database Connection**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Create .env file with your database credentials
   echo "DATABASE_URL=\"postgresql://username:password@localhost:5432/vessel_emissions?schema=public\"" > .env
   echo "PORT=3001" >> .env
   echo "NODE_ENV=development" >> .env
   ```

### 2. Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Run Database Migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Import Data from JSON Files**
   ```bash
   # Import vessels, emissions, and reference data
   npm run import-data
   ```
   
   This will import:
   - **4 vessels** from `vessels.json`
   - **8 PP reference entries** from `pp-reference.json`
   - **1,913 emissions records** from `daily-log-emissions.json`

5. **Start the Backend Server**
   ```bash
   npm run start:dev
   ```

### 3. Frontend Setup

1. **Install Dependencies**
   ```bash
   # From the root directory
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### 4. Combined Setup (Recommended)

**Start both frontend and backend with a single command:**
```bash
npm run dev:full
```

This will start:
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:3001`

**For production:**
```bash
npm run start:full
```

## Data Import

The application includes a comprehensive data import system that processes JSON files and imports them into PostgreSQL:

### Import Script Features

- **Automatic Field Mapping**: Maps JSON field names to database columns
- **Batch Processing**: Handles large datasets efficiently (1,000 records per batch)
- **Error Handling**: Graceful handling of missing or invalid data
- **Upsert Operations**: Prevents duplicate records
- **Progress Reporting**: Real-time import progress updates

### Imported Data

| Data Type | Source File | Records | Description |
|-----------|-------------|---------|-------------|
| Vessels | `vessels.json` | 4 | Vessel information (name, IMO, type) |
| PP Reference | `pp-reference.json` | 8 | Poseidon Principles baseline factors |
| Emissions | `daily-log-emissions.json` | 1,913 | Daily emissions data with multiple metrics |

### Running the Import

```bash
cd backend
npm run import-data
```

The script will:
1. Read all JSON files from the project root
2. Validate data structure
3. Import vessels first (for foreign key relationships)
4. Import PP reference data with proper decimal precision
5. Import emissions data with vessel lookups
6. Report import statistics

## Usage

### 1. Access the Application

Open your browser and navigate to `http://localhost:3000`

### 2. View Vessels

- The application displays a list of all available vessels
- Each vessel shows its name, IMO number, and vessel type
- Click "Select" to choose a vessel for analysis

### 3. Calculate Deviations

1. **Select a Vessel**: Choose a vessel from the dropdown or click "Select" on any vessel in the list
2. **Choose Year**: Select the year for which you want to calculate deviations
3. **Calculate**: Click "Calculate Deviations" to process the data

### 4. View Results

- **Chart Visualization**: Interactive Highcharts column chart showing quarterly deviations
- **Color Coding**: 
  - Red bars: Above baseline (higher emissions)
  - Green bars: Below baseline (lower emissions)
- **Statistics**: Average, best, and worst deviation percentages
- **Tooltips**: Detailed information on hover

### Dashboard Screenshot

![Vessel Emissions Dashboard](img/Visualization.png)

*The dashboard shows vessel emissions deviation analysis with interactive charts and vessel selection interface.*

## API Endpoints

### Backend API (http://localhost:3001)

#### Vessels
- `GET /vessels` - Get all vessels
- `GET /vessels/:id` - Get vessel by ID

#### Emissions
- `GET /emissions/vessel/:vesselId` - Get emissions for a vessel
- `GET /emissions/vessel/:vesselId/quarter-end/:year` - Get quarter-end emissions

#### Deviations
- `GET /deviations` - Get all calculated deviations
- `GET /deviations/vessel/:vesselId` - Get deviations for a specific vessel
- `POST /deviations/calculate/:vesselId/:year` - Calculate deviations for a vessel

#### Database
- `POST /seed` - Seed the database with initial data

## Data Models

### Vessel
- `id`: Primary key
- `name`: Vessel name
- `imoNo`: IMO number (unique)
- `vesselType`: Vessel type identifier

### DailyEmission
- `id`: Primary key
- `vesselId`: Reference to vessel
- `fromUTC`: Start timestamp
- `toUTC`: End timestamp
- `totW2wco2`: Total well-to-wake CO2 emissions
- Additional emission metrics (SOx, NOx, PM, CH4, N2O, HFC, SF6, PFC)

### PPSCCReferenceLine
- `id`: Primary key
- `vesselTypeId`: Vessel type reference
- `traj`: Trajectory type (MIN/STR)
- `a`, `b`, `c`, `d`, `e`: Poseidon Principles factors (30,12 decimal precision)

### VesselDeviation
- `id`: Primary key
- `vesselId`: Reference to vessel
- `quarter`: Quarter identifier (e.g., "2024-Q1")
- `year`: Year
- `quarterEnd`: Quarter end date
- `actualEmission`: Actual emission value
- `baselineEmission`: Calculated baseline
- `deviationPercentage`: Percentage deviation

## Technical Details

### Deviation Calculation

The application calculates deviations using the following process:

1. **Fetch Vessel Data**: Retrieve vessel information and Poseidon Principles reference factors
2. **Get Quarter-End Emissions**: Find emissions data for the last day of each quarter
3. **Calculate Baselines**: Use the `calculatePPSCCBaselines` utility with vessel-specific factors
4. **Compute Deviation**: Calculate percentage deviation from baseline
5. **Store Results**: Save calculated deviations to the database

### Baseline Formula

The Poseidon Principles baseline is calculated using:
```
baseline = (a*year³ + b*year² + c*year + d) * DWT^e
```

Where:
- `a`, `b`, `c`, `d`, `e` are vessel-specific factors
- `year` is the target year
- `DWT` is the vessel's deadweight tonnage

### Quarter-End Logic

The application identifies quarter-end data by finding the emission record closest to the last day of each quarter (March 31, June 30, September 30, December 31).

## Development

### Backend Development

```bash
cd backend
npm run start:dev    # Development mode with hot reload
npm run build        # Build for production
npm run start        # Production mode
npm run import-data  # Import data from JSON files
```

### Frontend Development

```bash
npm run dev          # Development mode
npm run build        # Build for production
npm run start        # Production mode
```

### Full Stack Development

```bash
npm run dev:full     # Start both frontend and backend in development mode
npm run start:full   # Start both frontend and backend in production mode
```

### Database Management

```bash
cd backend
npx prisma studio    # Open Prisma Studio for database management
npx prisma migrate   # Create new migration
npx prisma generate  # Regenerate Prisma client
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in backend/.env
   - Ensure database `vessel_emissions` exists

2. **Port Already in Use**
   - Backend: Change PORT in backend/.env
   - Frontend: Use `npm run dev -- -p 3001` to change port

3. **Prisma Client Not Generated**
   - Run `npx prisma generate` in backend directory
   - Restart the development server

4. **CORS Errors**
   - Ensure backend is running on port 3001
   - Check CORS configuration in backend/src/main.ts

5. **Data Import Errors**
   - Verify JSON files exist in project root
   - Check file permissions
   - Ensure database schema is up to date

### Data Issues

1. **No Vessels Displayed**
   - Run the data import: `npm run import-data`
   - Check database connection and data import logs

2. **No Emissions Data**
   - Verify daily-log-emissions.json is properly imported
   - Check vessel ID mappings in the database
   - Run import script again if needed

3. **Decimal Overflow Errors**
   - PP reference data uses high precision decimals (30,12)
   - Ensure database supports the precision requirements

## Performance

### Data Import Performance
- **Batch Size**: 1,000 records per batch for optimal performance
- **Memory Usage**: Efficient streaming for large JSON files
- **Error Recovery**: Continues processing even if individual records fail

### Application Performance
- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Efficient data retrieval patterns
- **Frontend Optimization**: React optimization and lazy loading