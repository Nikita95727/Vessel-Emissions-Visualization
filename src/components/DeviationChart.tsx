import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface Deviation {
  id: number;
  vesselId: number;
  quarter: string;
  year: number;
  quarterEnd: string;
  actualEmission: number;
  baselineEmission: number;
  deviationPercentage: number;
  vessel: {
    id: number;
    name: string;
    imoNo: number;
    vesselType: number;
  };
}

interface DeviationChartProps {
  deviations: Deviation[];
  vesselName: string;
  loading: boolean;
}

const DeviationChart: React.FC<DeviationChartProps> = ({
  deviations,
  vesselName,
  loading,
}) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    if (chartComponentRef.current) {
      chartComponentRef.current.chart.redraw();
    }
  }, [deviations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deviation data...</p>
        </div>
      </div>
    );
  }

  if (!deviations || deviations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No deviation data available. Click "Calculate Deviations" to generate data.
      </div>
    );
  }

  // Prepare data for Highcharts
  const chartData = deviations.map(deviation => ({
    name: deviation.quarter,
    y: parseFloat(deviation.deviationPercentage.toString()),
    actualEmission: parseFloat(deviation.actualEmission.toString()),
    baselineEmission: parseFloat(deviation.baselineEmission.toString()),
    quarterEnd: new Date(deviation.quarterEnd).toLocaleDateString(),
  }));

  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      height: 400,
    },
    title: {
      text: `Emissions Deviation from Poseidon Principles Baseline - ${vesselName}`,
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
    subtitle: {
      text: 'Percentage deviation from minimum baseline by quarter',
    },
    xAxis: {
      categories: chartData.map(d => d.name),
      title: {
        text: 'Quarter',
      },
    },
    yAxis: {
      title: {
        text: 'Deviation Percentage (%)',
      },
      labels: {
        formatter: function() {
          return this.value + '%';
        },
      },
      plotLines: [
        {
          value: 0,
          color: '#666',
          width: 1,
          zIndex: 2,
          label: {
            text: 'Baseline (0%)',
            style: {
              color: '#666',
            },
          },
        },
      ],
    },
    tooltip: {
      formatter: function() {
        const point = this.point as any;
        return `
          <b>${point.name}</b><br/>
          <b>Deviation:</b> ${point.y.toFixed(2)}%<br/>
          <b>Actual Emission:</b> ${point.actualEmission.toFixed(2)}<br/>
          <b>Baseline Emission:</b> ${point.baselineEmission.toFixed(2)}<br/>
          <b>Quarter End:</b> ${point.quarterEnd}
        `;
      },
    },
    plotOptions: {
      column: {
        colorByPoint: true,
        colors: chartData.map(d => {
          if (d.y > 0) {
            return '#ef4444'; // Red for above baseline
          } else if (d.y < 0) {
            return '#10b981'; // Green for below baseline
          } else {
            return '#6b7280'; // Gray for at baseline
          }
        }),
        dataLabels: {
          enabled: true,
          formatter: function() {
            return (this.y ?? 0).toFixed(1) + '%';
          },
          style: {
            fontWeight: 'bold',
          },
        },
      },
    },
    series: [
      {
        name: 'Deviation Percentage',
        data: chartData,
        type: 'column',
      },
    ],
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
  };

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
      />
      
      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Average Deviation</h3>
          <p className="text-2xl font-bold text-blue-900">
            {(chartData.reduce((sum, d) => sum + d.y, 0) / chartData.length).toFixed(1)}%
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Best Quarter</h3>
          <p className="text-2xl font-bold text-green-900">
            {Math.min(...chartData.map(d => d.y)).toFixed(1)}%
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-800">Worst Quarter</h3>
          <p className="text-2xl font-bold text-red-900">
            {Math.max(...chartData.map(d => d.y)).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeviationChart; 