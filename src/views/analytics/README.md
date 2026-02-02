# Analytics Screen

A static analytics dashboard with line graphs and metrics for monitoring chat support performance.

## Features

- **Total Overview**: Daily activity summary with percentage breakdowns
- **Messages Chart**: Line graph showing sent vs received messages over time
- **Calls Chart**: Multi-line graph tracking received, outgoing, and missed calls
- **Top Conversations**: Agent performance leaderboard
- **Response Time**: Average response time tracking
- **Customer Satisfaction**: Satisfaction score trends
- **Engagement Metrics**: Key performance indicators

## Static Data

Currently displays static/mock data for demonstration purposes. To connect to real data:

1. Create API endpoints in the backend for analytics data
2. Replace static data arrays with API calls
3. Update the data based on the selected time range (daily/weekly/monthly)

## Charts Used

- Line charts with filled areas for trends
- Multiple datasets for comparison
- Responsive design with Chart.js

## Navigation

Access via `/analytics` route or the "Analytics" link in the sidebar under Overview section.
