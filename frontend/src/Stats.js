import React, { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js'; // Import Chart and registerables
import { EdaContext } from './EdaContext'; // Import the EDA context

// Register all necessary components
Chart.register(...registerables);

const Stats = () => {
  const { stats, loading, error } = useContext(EdaContext);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (stats) {
      setChartData({
        labels: ['CGPA', 'Skills', 'Internships', 'Projects', 'Certifications'],
        datasets: [
          {
            label: 'Average Values',
            data: [
              stats.averages.cgpa || 0,
              stats.averages.skills || 0,
              stats.averages.internships || 0,
              stats.averages.projects || 0,
              stats.averages.certifications || 0,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [stats]);

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p>Error fetching stats: {error}</p>;

  if (!chartData.datasets || chartData.datasets.length === 0) {
    return <p>No data available for the chart.</p>;
  }

  return (
    <div className="stats-container">
      <h3>Placement Statistics</h3>
      <Bar data={chartData} options={{ responsive: true }} />
      <p><strong>Total Records:</strong> {stats.total_records}</p>
      <p><strong>Placement Rate:</strong> {stats.placement_rate}%</p>
    </div>
  );
};

export default Stats;