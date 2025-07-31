'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import VesselSelector from '../components/VesselSelector';
import DeviationChart from '../components/DeviationChart';
import VesselList from '../components/VesselList';

const API_BASE_URL = 'http://localhost:3001';

// Import types from components
interface Vessel {
  id: number;
  name: string;
  imoNo: number;
  vesselType: number;
}

interface Deviation {
  id: number;
  vesselId: number;
  quarter: string;
  year: number;
  quarterEnd: string;
  actualEmission: number;
  baselineEmission: number;
  deviationPercentage: number;
  vessel: Vessel;
}

export default function Home() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [deviations, setDeviations] = useState<Deviation[]>([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(2024);

  useEffect(() => {
    fetchVessels();
  }, []);

  useEffect(() => {
    if (selectedVessel) {
      fetchDeviations(selectedVessel.id, year);
    }
  }, [selectedVessel, year]);

  const fetchVessels = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vessels`);
      setVessels(response.data);
    } catch (error) {
      console.error('Error fetching vessels:', error);
    }
  };

  const fetchDeviations = async (vesselId: number, year: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/deviations/vessel/${vesselId}?year=${year}`);
      setDeviations(response.data);
    } catch (error) {
      console.error('Error fetching deviations:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDeviations = async (vesselId: number, year: number) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/deviations/vessel/${vesselId}/calculate/${year}`);
      await fetchDeviations(vesselId, year);
    } catch (error) {
      console.error('Error calculating deviations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Vessel Emissions Visualization
          </h1>
          <p className="text-gray-600">
            Monitor and analyze vessel emissions deviations from Poseidon Principles baselines
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vessel Selection Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Vessel Selection</h2>
              <VesselSelector
                vessels={vessels}
                selectedVessel={selectedVessel}
                onVesselSelect={setSelectedVessel}
                year={year}
                onYearChange={setYear}
                onCalculateDeviations={calculateDeviations}
                loading={loading}
              />
            </div>
          </div>

          {/* Chart Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Emissions Deviation Chart</h2>
              {selectedVessel ? (
                <DeviationChart
                  deviations={deviations}
                  vesselName={selectedVessel.name}
                  loading={loading}
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Select a vessel to view emissions deviations
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vessel List */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">All Vessels</h2>
            <VesselList vessels={vessels} onVesselSelect={setSelectedVessel} />
          </div>
        </div>
      </div>
    </div>
  );
} 