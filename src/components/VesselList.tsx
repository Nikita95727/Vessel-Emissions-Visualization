import React from 'react';

interface Vessel {
  id: number;
  name: string;
  imoNo: number;
  vesselType: number;
}

interface VesselListProps {
  vessels: Vessel[];
  onVesselSelect: (vessel: Vessel) => void;
}

const VesselList: React.FC<VesselListProps> = ({ vessels, onVesselSelect }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vessel Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              IMO Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vessel Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vessels.map((vessel) => (
            <tr key={vessel.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {vessel.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {vessel.imoNo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {vessel.vesselType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() => onVesselSelect(vessel)}
                  className="text-blue-600 hover:text-blue-900 font-medium"
                >
                  Select
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {vessels.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No vessels available
        </div>
      )}
    </div>
  );
};

export default VesselList; 