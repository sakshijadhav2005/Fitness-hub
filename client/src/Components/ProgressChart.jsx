import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

const ProgressChart = ({ logs, workouts }) => {
  const getWeeklyData = () => {
    const weeks = Array(12).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i * 7);
      return date.toISOString().split('T')[0].slice(0, 7);
    }).reverse();

    const counts = weeks.map((week) => {
      return logs.filter((log) => {
        const logDate = new Date(log.createdAt).toISOString().slice(0, 7);
        return logDate >= week;
      }).length;
    });

    return { labels: weeks.map((w) => `Week ${12 - weeks.indexOf(w)}`), data: counts };
  };

  const getCategoryData = () => {
    const categories = ['strength', 'cardio', 'yoga', 'other'];
    const counts = categories.map((cat) => logs.filter((log) => log.category === cat).length);
    return {
      labels: categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)),
      data: counts,
    };
  };

  const getDurationData = () => {
    const weeks = Array(12).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i * 7);
      return date.toISOString().split('T')[0].slice(0, 7);
    }).reverse();

    const durations = weeks.map((week) => {
      return logs
        .filter((log) => new Date(log.createdAt).toISOString().slice(0, 7) >= week)
        .reduce((sum, log) => {
          const workout = workouts.find((w) => w._id === log.workoutId);
          return sum + (workout ? workout.exercises.reduce((s, e) => s + (Number(e.duration) || 0), 0) : 0);
        }, 0);
    });

    return { labels: weeks.map((w) => `Week ${12 - weeks.indexOf(w)}`), data: durations };
  };

  const workoutData = getWeeklyData();
  const categoryData = getCategoryData();
  const durationData = getDurationData();

  const lineChartData = {
    labels: workoutData.labels,
    datasets: [{
      label: 'Workouts',
      data: workoutData.data,
      borderColor: 'rgba(20, 184, 166, 1)',
      backgroundColor: 'rgba(20, 184, 166, 0.2)',
      fill: true,
      tension: 0.4,
    }],
  };

  const doughnutChartData = {
    labels: categoryData.labels,
    datasets: [{
      label: 'Categories',
      data: categoryData.data,
      backgroundColor: ['rgba(20, 184, 166, 0.8)', 'rgba(168, 85, 247, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(239, 68, 68, 0.8)'],
      borderColor: 'rgba(255, 255, 255, 0.1)',
    }],
  };

  const barChartData = {
    labels: durationData.labels,
    datasets: [{
      label: 'Duration (min)',
      data: durationData.data,
      backgroundColor: 'rgba(168, 85, 247, 0.8)',
      borderColor: 'rgba(168, 85, 247, 1)',
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: 'white' } },
      tooltip: { backgroundColor: 'rgba(31, 41, 55, 0.8)', titleColor: 'white', bodyColor: 'white' },
    },
    scales: {
      x: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      y: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' }, beginAtZero: true },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-teal-400 mb-4">Workout Frequency</h3>
        <div className="h-64">
          <Line data={lineChartData} options={chartOptions} />
        </div>
      </div>
      <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-teal-400 mb-4">Category Distribution</h3>
        <div className="h-64 flex justify-center">
          <Doughnut data={doughnutChartData} options={{ ...chartOptions, cutout: '60%' }} />
        </div>
      </div>
      <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-teal-400 mb-4">Duration Trend</h3>
        <div className="h-64">
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;