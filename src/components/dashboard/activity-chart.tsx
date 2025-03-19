'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatNumber } from '@/lib/utils';

// Mock data for the line chart
const generateMockData = () => {
  const data = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      words: Math.floor(Math.random() * 2000) + 500,
    });
  }
  return data;
};

const ActivityChart: React.FC = () => {
  const chartData = generateMockData();
  const totalWords = chartData.reduce((sum, day) => sum + day.words, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="text-sm text-medium-gray">
            Total words generated this week: {formatNumber(totalWords)}
          </div>
          
          {/* Line chart for word generation trends */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => [formatNumber(value), 'Words']}
                />
                <Line
                  type="monotone"
                  dataKey="words"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  dot={{ fill: '#0EA5E9', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Activity heatmap */}
          <div>
            <div className="text-sm text-medium-gray mb-3">
              Activity Heatmap
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array(28)
                .fill(0)
                .map((_, i) => {
                  // Generate random activity level for demo purposes
                  const activity = Math.random();
                  let bgColor = 'bg-light-gray';
                  
                  if (activity > 0.9) bgColor = 'bg-secondary-teal';
                  else if (activity > 0.7) bgColor = 'bg-secondary-teal/70';
                  else if (activity > 0.5) bgColor = 'bg-secondary-teal/40';
                  else if (activity > 0.3) bgColor = 'bg-secondary-teal/20';
                  
                  return (
                    <div
                      key={i}
                      className={`h-4 w-4 rounded-sm ${bgColor}`}
                      title={`${Math.floor(activity * 100)}% activity`}
                    ></div>
                  );
                })}
            </div>
            
            <div className="flex justify-between text-xs text-medium-gray mt-2">
              <span>4 weeks ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityChart; 