'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCorpus } from '@/contexts/corpus-provider';

const WritingStyles: React.FC = () => {
  const { corpusStats } = useCorpus();
  
  const styles = [
    { 
      name: 'Professional', 
      active: true,
      description: 'Based on 15 documents',
      confidence: 0.92
    },
    { 
      name: 'Technical', 
      active: false,
      description: 'Based on 8 documents',
      confidence: 0.85
    },
    { 
      name: 'Casual', 
      active: false,
      description: 'Based on 12 documents',
      confidence: 0.88
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Writing Styles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {styles.map((style, index) => (
            <div key={index} className="space-y-2">
              <Button
                variant={style.active ? 'primary' : 'outline'}
                className="w-full justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span>{style.name}</span>
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
                </div>
                <div className="text-sm text-[#64748B]">
                  {Math.round(style.confidence * 100)}%
                </div>
              </Button>
              <div className="text-xs text-[#64748B] px-2">
                {style.description}
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-[#0EA5E9]">
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
            Train New Style
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WritingStyles; 