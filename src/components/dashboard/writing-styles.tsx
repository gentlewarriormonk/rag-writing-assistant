'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const WritingStyles: React.FC = () => {
  const styles = [
    { name: 'Professional', active: true },
    { name: 'Casual', active: false },
    { name: 'Technical', active: false },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Writing Styles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {styles.map((style, index) => (
            <Button
              key={index}
              variant={style.active ? 'primary' : 'outline'}
              className="w-full justify-between"
            >
              {style.name}
              {style.active && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              )}
            </Button>
          ))}
          <Button variant="ghost" className="w-full text-primary-blue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add New Style
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WritingStyles; 