import React from 'react';
import AppLayout from '@/components/layout/app-layout';
import StatsCard from '@/components/dashboard/stats-card';
import ActivityChart from '@/components/dashboard/activity-chart';
import QuickActions from '@/components/dashboard/quick-actions';
import WritingStyles from '@/components/dashboard/writing-styles';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-dark-gray">
            Welcome back, User
          </h1>
          <p className="text-medium-gray">
            Here's an overview of your writing assistant
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Your Corpus"
            stats={['35 Documents', '4 Categories']}
            actionText="View Corpus"
            actionUrl="/corpus"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            }
          />

          <StatsCard
            title="Recent Content"
            stats={['12 Generated', 'Last: 2h ago']}
            actionText="View History"
            actionUrl="/history"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            }
          />

          <div className="md:col-span-2">
            <ActivityChart />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <QuickActions />
          </div>
          <div>
            <WritingStyles />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Usage Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-medium-gray">
                        Words Generated:
                      </span>
                      <span className="text-sm font-medium">
                        12,450 / 15,000
                      </span>
                    </div>
                    <div className="w-full bg-light-gray rounded-full h-2">
                      <div
                        className="bg-secondary-teal h-2 rounded-full"
                        style={{ width: '83%' }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-medium-gray">
                        API Credits:
                      </span>
                      <span className="text-sm font-medium">
                        189 / 500
                      </span>
                    </div>
                    <div className="w-full bg-light-gray rounded-full h-2">
                      <div
                        className="bg-primary-blue h-2 rounded-full"
                        style={{ width: '38%' }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-medium-gray">
                        Storage Used:
                      </span>
                      <span className="text-sm font-medium">
                        0.45 GB / 5 GB
                      </span>
                    </div>
                    <div className="w-full bg-light-gray rounded-full h-2">
                      <div
                        className="bg-accent-coral h-2 rounded-full"
                        style={{ width: '9%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: 'Generated content',
                      title: 'Marketing Email',
                      time: '2 hours ago',
                    },
                    {
                      action: 'Uploaded document',
                      title: 'Q1 Report Draft.txt',
                      time: 'Yesterday',
                    },
                    {
                      action: 'Generated content',
                      title: 'Team Announcement',
                      time: 'Yesterday',
                    },
                    {
                      action: 'Generated content',
                      title: 'Product Description',
                      time: '3 days ago',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start pb-4 border-b border-light-gray last:border-0 last:pb-0"
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                          item.action.includes('Generated')
                            ? 'bg-secondary-teal/20 text-secondary-teal'
                            : 'bg-primary-blue/20 text-primary-blue'
                        }`}
                      >
                        {item.action.includes('Generated') ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-dark-gray">
                            {item.title}
                          </span>
                          <span className="text-sm text-medium-gray">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-sm text-medium-gray">
                          {item.action}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 