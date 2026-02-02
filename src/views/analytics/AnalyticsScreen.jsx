import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import TopNavbar from '../../components/TopNavbar';
import Sidebar from '../../components/Sidebar';
import { useTheme } from '../../context/ThemeContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsScreen = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { isDark } = useTheme();

  const toggleSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  // Static data for Messages line chart
  const messagesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sent',
        data: [850, 920, 1258, 1100, 980, 750, 680],
        borderColor: '#a78bfa',
        backgroundColor: 'rgba(167, 139, 250, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Received',
        data: [620, 580, 680, 750, 820, 550, 480],
        borderColor: '#c4b5fd',
        backgroundColor: 'rgba(196, 181, 253, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  // Static data for Response Time
  const responseTimeData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Avg Response Time (min)',
        data: [3.5, 2.8, 3.2, 2.5, 3.0, 4.2, 3.8],
        borderColor: '#34d399',
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  // Static data for Customer Satisfaction
  const satisfactionData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Satisfaction Score',
        data: [4.2, 4.5, 4.3, 4.6, 4.4, 4.1, 4.3],
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: isDark ? '#d1d1d1' : '#6b7280',
          font: { size: 10 },
          padding: 8,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDark ? '#3a3a3a' : '#ffffff',
        titleColor: isDark ? '#f5f5f5' : '#1a1a1a',
        bodyColor: isDark ? '#d1d1d1' : '#6b7280',
        borderColor: isDark ? '#4a4a4a' : '#e5e7eb',
        borderWidth: 1,
        padding: 8,
        bodyFont: { size: 11 },
        titleFont: { size: 11, weight: 'bold' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: isDark ? '#d1d1d1' : '#6b7280',
          font: { size: 10 }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#d1d1d1' : '#6b7280',
          font: { size: 10 }
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <TopNavbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isMobile={false}
          isOpen={mobileSidebarOpen}
          toggleDropdown={toggleDropdown}
          openDropdown={openDropdown}
        />
        <main className="flex-1 overflow-y-auto p-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
            <div className="flex gap-2">
              <button className="px-2.5 py-1 text-xs bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition">
                Export
              </button>
              <button 
                className="px-2.5 py-1 text-xs rounded-lg transition"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  color: 'var(--text-primary)',
                  border: `1px solid var(--border-color)`
                }}
              >
                ⋯
              </button>
            </div>
          </div>

          {/* Total Overview Card */}
          <div 
            className="rounded-lg shadow-sm p-2.5 mb-2"
            style={{ 
              backgroundColor: 'var(--card-bg)',
              border: `1px solid var(--border-color)`
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>Total overview</h2>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                  Your average daily activity over the last 7 days are <span className="font-semibold">67%</span>
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-green-600 text-[10px] font-semibold">↑ 24%</span>
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-1.5 py-0.5 text-[10px] rounded"
                  style={{ 
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    border: `1px solid var(--border-color)`
                  }}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded"></div>
                <span style={{ color: 'var(--text-secondary)' }}>Messages</span>
                <span className="ml-auto font-semibold" style={{ color: 'var(--text-primary)' }}>65%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded"></div>
                <span style={{ color: 'var(--text-secondary)' }}>Top conversations</span>
                <span className="ml-auto font-semibold" style={{ color: 'var(--text-primary)' }}>35%</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            {/* Messages Card */}
            <div 
              className="rounded-lg shadow-sm p-2.5"
              style={{ 
                backgroundColor: 'var(--card-bg)',
                border: `1px solid var(--border-color)`
              }}
            >
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-secondary)' }}>Messages</p>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>23,456</h3>
                  <span className="text-green-600 text-[10px]">↑ 3%</span>
                </div>
                <select 
                  className="px-1.5 py-0.5 rounded text-[10px]"
                  style={{ 
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    border: `1px solid var(--border-color)`
                  }}
                >
                  <option>Weekly</option>
                  <option>Daily</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className="h-28">
                <Line data={messagesData} options={chartOptions} />
              </div>
            </div>

            {/* Top Conversations Card */}
            <div 
              className="rounded-lg shadow-sm p-2.5"
              style={{ 
                backgroundColor: 'var(--card-bg)',
                border: `1px solid var(--border-color)`
              }}
            >
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-secondary)' }}>Top conversations</p>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>460</h3>
                  <span className="text-green-600 text-[10px]">↑ 8%</span>
                </div>
                <select 
                  className="px-1.5 py-0.5 rounded text-[10px]"
                  style={{ 
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    border: `1px solid var(--border-color)`
                  }}
                >
                  <option>Weekly</option>
                  <option>Daily</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className="space-y-1.5">
                {[
                  { name: 'Leslie Alexander', messages: 324, color: 'bg-yellow-400' },
                  { name: 'John Smith', messages: 298, color: 'bg-blue-400' },
                  { name: 'Sarah Johnson', messages: 276, color: 'bg-green-400' },
                  { name: 'Mike Davis', messages: 245, color: 'bg-purple-400' },
                ].map((agent, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 ${agent.color} rounded-full flex items-center justify-center text-white font-semibold text-[9px]`}>
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[10px] truncate" style={{ color: 'var(--text-primary)' }}>{agent.name}</p>
                      <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>Messages: {agent.messages}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            {/* Response Time */}
            <div 
              className="rounded-lg shadow-sm p-2.5"
              style={{ 
                backgroundColor: 'var(--card-bg)',
                border: `1px solid var(--border-color)`
              }}
            >
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-secondary)' }}>Average Response Time</p>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>3.2 min</h3>
                  <span className="text-green-600 text-[10px]">↓ 12% faster</span>
                </div>
                <select 
                  className="px-1.5 py-0.5 rounded text-[10px]"
                  style={{ 
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    border: `1px solid var(--border-color)`
                  }}
                >
                  <option>Weekly</option>
                  <option>Daily</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className="h-32">
                <Line data={responseTimeData} options={chartOptions} />
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div 
              className="rounded-lg shadow-sm p-2.5"
              style={{ 
                backgroundColor: 'var(--card-bg)',
                border: `1px solid var(--border-color)`
              }}
            >
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-secondary)' }}>Customer Satisfaction</p>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>4.3/5.0</h3>
                  <span className="text-green-600 text-[10px]">↑ 5%</span>
                </div>
                <select 
                  className="px-1.5 py-0.5 rounded text-[10px]"
                  style={{ 
                    backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    border: `1px solid var(--border-color)`
                  }}
                >
                  <option>Weekly</option>
                  <option>Daily</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className="h-32">
                <Line data={satisfactionData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div 
            className="rounded-lg shadow-sm p-2.5"
            style={{ 
              backgroundColor: 'var(--card-bg)',
              border: `1px solid var(--border-color)`
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Engagement metrics</h2>
              <select 
                className="px-1.5 py-0.5 text-[10px] rounded"
                style={{ 
                  backgroundColor: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  border: `1px solid var(--border-color)`
                }}
              >
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <div className="text-xl font-bold text-violet-600 mb-0.5">89%</div>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Active Users</p>
                <span className="text-green-600 text-[10px]">↑ 12%</span>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600 mb-0.5">2.4h</div>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Avg Session Time</p>
                <span className="text-green-600 text-[10px]">↑ 8%</span>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600 mb-0.5">94%</div>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Resolution Rate</p>
                <span className="text-green-600 text-[10px]">↑ 3%</span>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-600 mb-0.5">1.8k</div>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Total Tickets</p>
                <span className="text-red-600 text-[10px]">↓ 5%</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsScreen;
