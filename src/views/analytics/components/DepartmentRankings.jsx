import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'react-feather';
import analyticsService from '../../../services/analytics.service';
import { useUser } from '../../../context/UserContext';

/**
 * DepartmentRankings Component
 * Shows agent rankings within departments based on customer satisfaction ratings
 */
export default function DepartmentRankings({ period, className }) {
  const { userData } = useUser();
  const [rankings, setRankings] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentIndex, setSelectedDepartmentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user's departments
  useEffect(() => {
    const userDepartments = userData?.departments || [];
    setDepartments(userDepartments);
    if (userDepartments.length > 0) {
      setSelectedDepartmentIndex(0);
    }
  }, [userData]);

  // Fetch rankings when department or period changes
  useEffect(() => {
    const fetchRankings = async () => {
      if (departments.length === 0) return;

      try {
        setLoading(true);
        setError(null);
        
        const selectedDepartment = departments[selectedDepartmentIndex];
        const data = await analyticsService.getDepartmentRankings(
          selectedDepartment.dept_id, 
          period, 
          5
        );
        
        setRankings(data);
      } catch (err) {
        console.error('Error fetching department rankings:', err);
        setError(err.message || 'Failed to fetch rankings');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [departments, selectedDepartmentIndex, period]);

  // Navigate between departments
  const handlePrevDepartment = () => {
    setSelectedDepartmentIndex(prev => 
      prev > 0 ? prev - 1 : departments.length - 1
    );
  };

  const handleNextDepartment = () => {
    setSelectedDepartmentIndex(prev => 
      prev < departments.length - 1 ? prev + 1 : 0
    );
  };

  // Get rank color based on position
  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-yellow-400'; // Gold
      case 2: return 'bg-gray-400';   // Silver
      case 3: return 'bg-orange-400'; // Bronze
      default: return 'bg-blue-400';  // Default
    }
  };

  // Get rank icon
  const getRankIcon = (rank) => {
    if (rank <= 3) {
      return <Star size={10} className="text-white" />;
    }
    return <span className="text-white font-bold text-[8px]">{rank}</span>;
  };

  if (departments.length === 0) {
    return (
      <div className={`${className} rounded-lg shadow-sm p-2.5`}
           style={{ 
             backgroundColor: 'var(--card-bg)',
             border: `1px solid var(--border-color)`
           }}>
        <div className="text-center py-4">
          <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
            No departments available
          </p>
        </div>
      </div>
    );
  }

  const selectedDepartment = departments[selectedDepartmentIndex];

  return (
    <div className={`${className} rounded-lg shadow-sm p-2.5`}
         style={{ 
           backgroundColor: 'var(--card-bg)',
           border: `1px solid var(--border-color)`
         }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-1.5">
        <div className="flex-1">
          <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-secondary)' }}>
            Department Rankings
          </p>
          <h3 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
            {selectedDepartment?.dept_name || 'Loading...'}
          </h3>
          <span className="text-green-600 text-[10px]">
            {rankings ? `${rankings.totalAgents} agents` : 'Loading...'}
          </span>
        </div>
        
        {/* Department Navigation */}
        {departments.length > 1 && (
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={handlePrevDepartment}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ChevronLeft size={12} />
            </button>
            <span className="text-[9px] px-1" style={{ color: 'var(--text-secondary)' }}>
              {selectedDepartmentIndex + 1}/{departments.length}
            </span>
            <button
              onClick={handleNextDepartment}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ChevronRight size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Rankings List */}
      <div className="space-y-1.5">
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-600 mx-auto mb-2"></div>
            <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Loading rankings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-[10px] text-red-500 mb-1">{error}</p>
          </div>
        ) : rankings?.rankings?.length > 0 ? (
          rankings.rankings.map((agent) => (
            <div key={agent.agentId} className="flex items-center gap-1.5">
              <div className={`w-5 h-5 ${getRankColor(agent.rank)} rounded-full flex items-center justify-center`}>
                {getRankIcon(agent.rank)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[10px] truncate" style={{ color: 'var(--text-primary)' }}>
                  {agent.agentName}
                </p>
                <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>
                  ⭐ {agent.averageRating}/5.0 • {agent.totalRatings} ratings • {agent.satisfactionRate}% satisfied
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
              No rankings available for this period
            </p>
          </div>
        )}
      </div>
    </div>
  );
}