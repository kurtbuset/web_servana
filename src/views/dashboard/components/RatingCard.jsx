import { useAnalytics } from "../../../hooks/useAnalytics";
import { useUser } from "../../../context/UserContext";
import { useEffect, useState } from "react";

export default function RatingCard({ period, selectedDate, selectedWeek, selectedMonth, selectedYear }) {
    const { getRoleName } = useUser();
    const [forceUpdate, setForceUpdate] = useState(0);
    const [debugInfo, setDebugInfo] = useState('');
    
    const analyticsDate = period === 'daily' ? selectedDate : null;
    const analyticsWeek = period === 'weekly' ? selectedWeek : null;
    const analyticsMonth = period === 'monthly' ? selectedMonth : null;
    const analyticsYear = period === 'yearly' ? selectedYear : null;
    
    const { customerSatisfaction, dashboardStats, loading, error, refreshAnalytics } = useAnalytics(
        period, 
        analyticsDate, 
        analyticsWeek, 
        analyticsMonth, 
        analyticsYear
    );

    const isAgent = getRoleName() === 'Agent';
                               // Prioritize dashboardStats over customerSatisfaction (dashboardStats is faster and more reliable)
    const rating = dashboardStats?.satisfaction?.averageRating || customerSatisfaction?.averageRating || 0;
    const totalReviews = dashboardStats?.satisfaction?.totalRatings || customerSatisfaction?.totalRatings || 0;
    
    // Better handling of rating distribution with proper fallback and type checking
    let ratingDistribution = dashboardStats?.satisfaction?.ratingDistribution || 
                            customerSatisfaction?.ratingDistribution || 
                            {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};

    // Ensure ratingDistribution is properly formatted
    if (typeof ratingDistribution === 'object' && ratingDistribution !== null) {
        // Convert string keys to numbers and ensure all ratings 1-5 exist
        const normalizedDistribution = {};
        for (let i = 1; i <= 5; i++) {
            normalizedDistribution[i] = parseInt(ratingDistribution[i]) || 0;
        }
        ratingDistribution = normalizedDistribution;
    } else {
        ratingDistribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    }

    // Debug logging with more detail
    useEffect(() => {
        const debugData = {
            loading,
            error: error?.message || null,
            hasCustomerSatisfaction: !!customerSatisfaction,
            hasDashboardStats: !!dashboardStats,
            rating,
            totalReviews,
            ratingDistribution,
            customerSatisfactionKeys: customerSatisfaction ? Object.keys(customerSatisfaction) : [],
            dashboardStatsKeys: dashboardStats ? Object.keys(dashboardStats) : []
        };
        
        console.log('🔍 RatingCard Debug Info:', debugData);
        setDebugInfo(JSON.stringify(debugData, null, 2));
        
        // Force update if data changes
        if (customerSatisfaction || dashboardStats) {
            setForceUpdate(prev => prev + 1);
        }
    }, [customerSatisfaction, dashboardStats, ratingDistribution, totalReviews, rating, loading, error]);

    const formatPeriodLabel = () => {
        switch (period) {
            case 'daily':
                return 'today';
            case 'weekly':
                return 'this week';
            case 'monthly':
                return 'this month';
            case 'yearly':
                return 'this year';
            default:
                return 'this week';
        }
    };

    const handleRefresh = () => {
        console.log('🔄 Manually refreshing analytics...');
        refreshAnalytics();
    };

    if (loading) {
        return (
            <div className="card card-gold" style={{ justifyContent: 'space-between' }}>
                <div className="card-title">
                    <span className="card-title-dot gold"></span>
                    {isAgent ? 'My Ratings' : 'Ratings'}
                </div>
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                    <div style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--muted)' }}>
                        Loading ratings...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card card-gold" style={{ justifyContent: 'space-between' }}>
                <div className="card-title">
                    <span className="card-title-dot gold"></span>
                    {isAgent ? 'My Ratings' : 'Ratings'}
                </div>
                <div className="flex flex-col items-center justify-center h-32 text-center">
                    <div style={{ color: 'var(--muted)', fontSize: '11px', marginBottom: '8px' }}>
                        Error: {error.message || 'Failed to load ratings'}
                    </div>
                    <button 
                        onClick={handleRefresh}
                        style={{
                            background: 'var(--gold)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '10px',
                            cursor: 'pointer'
                        }}
                    >
                        Retry
                    </button>
                    {/* Debug info in error state */}
                    <details style={{ marginTop: '8px', fontSize: '8px', color: 'var(--muted)' }}>
                        <summary>Debug Info</summary>
                        <pre style={{ fontSize: '8px', textAlign: 'left', maxHeight: '100px', overflow: 'auto' }}>
                            {debugInfo}
                        </pre>
                    </details>
                </div>
            </div>
        );
    }

    return (
        <div className="card card-gold" style={{ justifyContent: 'space-between' }} key={forceUpdate}>
            <div className="card-title">
                <span className="card-title-dot gold"></span>
                {isAgent ? 'My Ratings' : 'Ratings'}
                <button 
                    onClick={handleRefresh}
                    style={{
                        marginLeft: 'auto',
                        background: 'transparent',
                        border: '1px solid rgba(217, 119, 6, 0.2)',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontSize: '8px',
                        color: 'var(--gold)',
                        cursor: 'pointer'
                    }}
                    title="Refresh ratings"
                >
                    ↻
                </button>
            </div>
            
            {/* Main rating display - now using horizontal layout */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: '20px',
                flex: 1
            }}>
                {/* Left side - Rating and stars */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div className="rating-big">
                        {rating.toFixed(1)}
                        <span style={{ 
                            fontSize: '26px', 
                            color: 'var(--muted)', 
                            fontWeight: '400' 
                        }}>
                            /5
                        </span>
                    </div>
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <div 
                                key={star} 
                                className="star"
                                style={{
                                    opacity: star <= Math.floor(rating) ? 1 : 
                                            star === Math.ceil(rating) ? rating % 1 : 0.3
                                }}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Right side - Rating distribution bars */}
                {totalReviews > 0 && ratingDistribution && Object.keys(ratingDistribution).length > 0 ? (
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '4px',
                        minWidth: '120px',
                        flex: 1
                    }}>
                        {[5, 4, 3, 2, 1].map((starLevel) => {
                            const count = parseInt(ratingDistribution[starLevel]) || 0;
                            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                            
                            return (
                                <div key={starLevel} style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    fontSize: '10px',
                                    color: 'var(--muted)'
                                }}>
                                    <span style={{ minWidth: '8px', fontWeight: '500' }}>{starLevel}</span>
                                    <div style={{ 
                                        flex: 1, 
                                        height: '6px', 
                                        background: 'rgba(217, 119, 6, 0.1)', 
                                        borderRadius: '3px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{ 
                                            width: `${Math.max(percentage, 0)}%`, 
                                            height: '100%', 
                                            background: percentage > 0 ? 'var(--gold)' : 'transparent',
                                            borderRadius: '3px',
                                            transition: 'width 0.3s ease'
                                        }}></div>
                                    </div>
                                    <span style={{ 
                                        minWidth: '20px', 
                                        textAlign: 'right',
                                        fontWeight: '500',
                                        color: count > 0 ? 'var(--text)' : 'var(--muted)'
                                    }}>
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Show message when no ratings available */
                    <div style={{ 
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--muted)',
                        fontSize: '12px',
                        fontStyle: 'italic'
                    }}>
                        No ratings yet
                    </div>
                )}
            </div>

            {/* Bottom text */}
            <div style={{ 
                fontSize: '10.5px',
                color: 'var(--muted)', 
                lineHeight: '1.4',
                textAlign: 'center',
                marginTop: '8px'
            }}>
                Based on <strong style={{ color: 'var(--text)' }}>
                    {totalReviews}
                </strong> {totalReviews === 1 ? 'review' : 'reviews'} {formatPeriodLabel()}
            </div>
        </div>
    );
}