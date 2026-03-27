/**
 * useAnalytics Hook Usage Examples
 * 
 * The consolidated useAnalytics hook provides both legacy and enhanced analytics
 * in a single, easy-to-use interface with backward compatibility.
 */

import { useAnalytics } from './useAnalytics';

// Example 1: Basic Usage (Backward Compatible)
function DashboardComponent() {
  const { 
    messageAnalytics,      // Legacy: Message counts over time
    responseTimeAnalytics, // Legacy: First response time only
    dashboardStats,        // Real-time dashboard statistics
    loading, 
    error 
  } = useAnalytics('weekly');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Dashboard Stats</h2>
      <p>Active Chats: {dashboardStats?.activeChats}</p>
      <p>Avg Response Time: {dashboardStats?.avgResponseTime}</p>
      
      <h2>Message Trends</h2>
      <Chart data={messageAnalytics} />
    </div>
  );
}

// Example 2: Enhanced Features (New ART Analytics)
function AdvancedAnalyticsComponent() {
  const { 
    enhancedResponseTime,     // New: ART formula analytics
    agentPerformance,         // New: Individual agent metrics
    getResponseTimeInsights,  // Helper function
    getTopPerformingAgents,   // Helper function
    hasEnhancedData,          // Status flag
    formatTime                // Utility function
  } = useAnalytics('weekly');

  const insights = getResponseTimeInsights();
  const topAgents = getTopPerformingAgents(3);

  return (
    <div>
      <h2>Enhanced Response Time Analytics</h2>
      {hasEnhancedData ? (
        <div>
          <p>Overall ART: {insights?.formatted}</p>
          <p>Performance: {insights?.performance}</p>
          <p>Total Responses: {insights?.totalResponses}</p>
          <p>Trend: {insights?.trend}</p>
        </div>
      ) : (
        <p>Enhanced analytics not available (run migration to enable)</p>
      )}

      <h2>Top Performing Agents</h2>
      {topAgents.map(agent => (
        <div key={agent.sys_user_id}>
          <p>{agent.agent_name}: {formatTime(agent.avg_response_time_seconds)}</p>
        </div>
      ))}
    </div>
  );
}

// Example 3: Smart Response Time Selection
function SmartResponseTimeComponent() {
  const { 
    getResponseTimeData,
    loading 
  } = useAnalytics('weekly');

  const responseTime = getResponseTimeData();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Response Time Analysis</h2>
      {responseTime ? (
        <div>
          <p>Data Type: {responseTime.type}</p>
          <p>Formula: {responseTime.formula}</p>
          
          {responseTime.type === 'enhanced' ? (
            <div>
              <p>ART: {responseTime.insights?.formatted}</p>
              <p>Performance: {responseTime.insights?.performance}</p>
            </div>
          ) : (
            <div>
              <p>Legacy response time data</p>
              <p>Average: {responseTime.data?.average}m</p>
            </div>
          )}
        </div>
      ) : (
        <p>No response time data available</p>
      )}
    </div>
  );
}

// Example 4: Admin Functions
function AdminAnalyticsComponent() {
  const { 
    recalculateResponseTimes,
    hasEnhancedData,
    loading 
  } = useAnalytics('weekly');

  const handleRecalculate = async () => {
    try {
      const message = await recalculateResponseTimes();
      alert(message);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Admin Functions</h2>
      <p>Enhanced Data Available: {hasEnhancedData ? 'Yes' : 'No'}</p>
      
      <button 
        onClick={handleRecalculate}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Recalculate Response Times'}
      </button>
      
      {!hasEnhancedData && (
        <p>
          Run the enhanced response time migration to enable ART analytics:
          <br />
          <code>node backend_servana/scripts/implement-enhanced-response-time.js</code>
        </p>
      )}
    </div>
  );
}

// Example 5: Complete Analytics Dashboard
function CompleteAnalyticsDashboard() {
  const analytics = useAnalytics('weekly');
  
  const {
    // Legacy data
    messageAnalytics,
    dashboardStats,
    
    // Enhanced data
    enhancedResponseTime,
    agentPerformance,
    
    // Helpers
    getResponseTimeData,
    getTopPerformingAgents,
    
    // State
    loading,
    error,
    hasEnhancedData
  } = analytics;

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>Error: {error}</div>;

  const responseTimeData = getResponseTimeData();
  const topAgents = getTopPerformingAgents(5);

  return (
    <div>
      {/* Dashboard Overview */}
      <section>
        <h2>Dashboard Overview</h2>
        <div className="stats-grid">
          <div>Active Chats: {dashboardStats?.activeChats}</div>
          <div>Pending: {dashboardStats?.pendingChats}</div>
          <div>Resolved Today: {dashboardStats?.resolvedToday}</div>
          <div>Active Agents: {dashboardStats?.activeAgents}</div>
        </div>
      </section>

      {/* Message Trends */}
      <section>
        <h2>Message Trends</h2>
        <MessageChart data={messageAnalytics} />
      </section>

      {/* Response Time Analysis */}
      <section>
        <h2>Response Time Analysis</h2>
        {responseTimeData && (
          <ResponseTimeChart 
            data={responseTimeData.data}
            type={responseTimeData.type}
            insights={responseTimeData.insights}
          />
        )}
      </section>

      {/* Agent Performance (if enhanced data available) */}
      {hasEnhancedData && (
        <section>
          <h2>Agent Performance</h2>
          <AgentPerformanceTable agents={topAgents} />
        </section>
      )}

      {/* Migration Notice */}
      {!hasEnhancedData && (
        <div className="notice">
          <p>💡 Enhanced analytics with ART formula available!</p>
          <p>Run the migration to unlock agent performance metrics and comprehensive response time analysis.</p>
        </div>
      )}
    </div>
  );
}

export {
  DashboardComponent,
  AdvancedAnalyticsComponent,
  SmartResponseTimeComponent,
  AdminAnalyticsComponent,
  CompleteAnalyticsDashboard
};