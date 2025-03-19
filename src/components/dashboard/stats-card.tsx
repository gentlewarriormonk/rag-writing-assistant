'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  stats: string[];
  actionText: string;
  actionUrl: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  stats,
  actionText,
  actionUrl,
  icon,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="text-primary-blue">{icon}</div>
          <Link
            href={actionUrl}
            className="text-sm text-primary-blue hover:text-primary-blue/80"
          >
            {actionText}
          </Link>
        </div>
        <h3 className="mt-4 font-heading font-semibold text-dark-gray">{title}</h3>
        <div className="mt-2 space-y-1">
          {stats.map((stat, index) => (
            <p key={index} className="text-medium-gray">
              {stat}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard; 