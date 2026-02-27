import { useMemo, lazy, Suspense } from 'react';

// Lazy load ApexCharts to handle missing dependency gracefully
const ReactApexChart = lazy(() => 
  import('react-apexcharts')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: () => <ChartPlaceholder /> }))
);

// Placeholder component when ApexCharts is not available
function ChartPlaceholder() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-4">
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          📊 Installing ApexCharts...
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px' }}>
          Please restart the dev server after installation
        </p>
      </div>
    </div>
  );
}

/**
 * ChartCard - Reusable chart component using ApexCharts
 */
export default function ChartCard({ title, value, trend, chartData, chartColor, isDark, className, headerAction }) {
    // ApexCharts configuration
    const chartOptions = useMemo(() => ({
        chart: {
            type: 'area',
            height: '100%',
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            },
            background: 'transparent'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2,
            colors: [chartColor]
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            },
            colors: [chartColor]
        },
        grid: {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 10
            }
        },
        xaxis: {
            categories: chartData.categories,
            labels: {
                style: {
                    colors: isDark ? '#d1d1d1' : '#6b7280',
                    fontSize: '11px'
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            tooltip: {
                enabled: false
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: isDark ? '#d1d1d1' : '#6b7280',
                    fontSize: '11px'
                },
                formatter: (value) => Math.round(value)
            }
        },
        tooltip: {
            enabled: true,
            theme: isDark ? 'dark' : 'light',
            x: {
                show: true
            },
            y: {
                formatter: (value) => Math.round(value).toLocaleString()
            },
            style: {
                fontSize: '12px'
            }
        },
        legend: {
            show: false
        },
        colors: [chartColor]
    }), [chartData.categories, chartColor, isDark]);

    return (
        <div className={`${className} rounded-lg shadow-sm p-4 border flex flex-col`}
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between items-start mb-3 flex-shrink-0">
                <div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{title}</p>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</h3>
                    {trend && (
                        <span className={`text-sm font-medium ${trend.startsWith('+') || trend.startsWith('↑') ? 'text-green-600' : 'text-red-600'}`}>
                            {trend}
                        </span>
                    )}
                </div>
                {headerAction && (
                    <div className="ml-4">
                        {headerAction}
                    </div>
                )}
            </div>
            <div className="flex-1 min-h-0">
                <Suspense fallback={<ChartPlaceholder />}>
                    <ReactApexChart
                        options={chartOptions}
                        series={chartData.series}
                        type="area"
                        height="100%"
                    />
                </Suspense>
            </div>
        </div>
    );
}
