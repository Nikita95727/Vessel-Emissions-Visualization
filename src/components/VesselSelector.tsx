import React from 'react';

interface Vessel {
  id: number;
  name: string;
  imoNo: number;
  vesselType: number;
}

interface VesselSelectorProps {
  vessels: Vessel[];
  selectedVessel: Vessel | null;
  onVesselSelect: (vessel: Vessel) => void;
  year: number;
  onYearChange: (year: number) => void;
  onCalculateDeviations: (vesselId: number, year: number) => void;
  loading: boolean;
}

const VesselSelector: React.FC<VesselSelectorProps> = ({
  vessels,
  selectedVessel,
  onVesselSelect,
  year,
  onYearChange,
  onCalculateDeviations,
  loading,
}) => {
  const handleCalculate = () => {
    if (selectedVessel) {
      onCalculateDeviations(selectedVessel.id, year);
    }
  };

  return (
    <div className="space-y-4">
      {/* Year Selector */}
      <div>
        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
          Year
        </label>
        <select
          id="year"
          value={year}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={2023}>2023</option>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
      </div>

      {/* Vessel Selector */}
      <div>
        <label htmlFor="vessel" className="block text-sm font-medium text-gray-700 mb-2">
          Select Vessel
        </label>
        <select
          id="vessel"
          value={selectedVessel?.id || ''}
          onChange={(e) => {
            const vessel = vessels.find(v => v.id === parseInt(e.target.value));
            if (vessel) {
              onVesselSelect(vessel);
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose a vessel...</option>
          {vessels.map((vessel) => (
            <option key={vessel.id} value={vessel.id}>
              {vessel.name} (IMO: {vessel.imoNo})
            </option>
          ))}
        </select>
      </div>

      {/* Calculate Button */}
      {selectedVessel && (
        <div>
          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Calculating...' : 'Calculate Deviations'}
          </button>
        </div>
      )}

      {/* Selected Vessel Info */}
      {selectedVessel && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium text-gray-900 mb-2">Selected Vessel</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Name:</strong> {selectedVessel.name}</p>
            <p><strong>IMO:</strong> {selectedVessel.imoNo}</p>
            <p><strong>Type:</strong> {selectedVessel.vesselType}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VesselSelector; 