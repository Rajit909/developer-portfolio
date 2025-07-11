
"use client";

import React, { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const WEEKS = 53;
const DAYS_IN_WEEK = 7;
const TOTAL_DAYS = WEEKS * DAYS_IN_WEEK;

const generateActivityData = () => {
    const data = Array.from({ length: TOTAL_DAYS }, (_, i) => {
        const today = new Date();
        const date = new Date(today);
        date.setDate(today.getDate() - (TOTAL_DAYS - 1 - i));
        
        let level = 0;
        const dayOfWeek = date.getDay();

        // Higher chance of contributions on weekdays
        const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;
        const baseProbability = isWeekday ? 0.7 : 0.3;

        if (Math.random() < baseProbability) {
            level = Math.floor(Math.random() * 4) + 1; // Levels 1-4
        }

        return {
            date: date.toISOString().split('T')[0],
            level,
            contributions: level > 0 ? Math.floor(Math.random() * 20) + 1 : 0
        };
    });
    return data;
};

const getMonthLabels = () => {
    const labels = [];
    const today = new Date();
    let currentDate = new Date(today);
    currentDate.setDate(today.getDate() - TOTAL_DAYS + 1);
    
    for (let i = 0; i < WEEKS; i += 4) {
        const month = currentDate.toLocaleString('default', { month: 'short' });
        labels.push({ month, week: Math.floor(i / 4) * 4 });
        currentDate.setDate(currentDate.getDate() + 28);
    }
    return labels;
}

const GitHubActivity = () => {
    const [activityData, setActivityData] = useState<any[]>([]);

    useEffect(() => {
        // This useEffect ensures the component only renders on the client
        // to avoid hydration mismatches with the randomly generated data.
        setActivityData(generateActivityData());
    }, []);

    const monthLabels = getMonthLabels();

    if (activityData.length === 0) {
        // Render a placeholder or skeleton while waiting for client-side mount
        return <div className="p-4 border rounded-lg bg-card text-card-foreground h-40 animate-pulse"></div>;
    }
    
    const grid = Array.from({ length: DAYS_IN_WEEK }, () => Array(WEEKS).fill(null));

    activityData.forEach((day, index) => {
        const date = new Date(day.date);
        const dayOfWeek = date.getDay();
        const week = Math.floor(index / DAYS_IN_WEEK);
        if (week < WEEKS) {
            grid[dayOfWeek][week] = day;
        }
    });


    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <TooltipProvider>
            <div className="p-4 border rounded-lg bg-card text-card-foreground">
                <div className="flex justify-start text-xs text-muted-foreground mb-2">
                    {monthLabels.map(({ month, week }) => (
                        <div key={month} style={{ marginLeft: `${week * 14}px`, position: 'absolute' }}>
                            {month}
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <div className="grid gap-[2px] text-xs text-muted-foreground mt-6">
                        {dayLabels.map(day => <div key={day} className="h-3">{day}</div>).filter((_, i) => i % 2 !== 0)}
                    </div>
                    <div className="grid grid-cols-53 grid-rows-7 gap-[2px] mt-6">
                        {grid.flat().map((day, index) => (
                            <Tooltip key={index} delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <div
                                        className="w-3 h-3 rounded-sm"
                                        style={{ backgroundColor: `var(--contribution-level-${day?.level ?? 0})` }}
                                    ></div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs">
                                        {day ? `${day.contributions} contributions on ${new Date(day.date).toDateString()}` : 'No contributions'}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </div>
                 <div className="flex justify-end items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <span>Less</span>
                    <div className="w-3 h-3 rounded-sm bg-contribution-level-0"></div>
                    <div className="w-3 h-3 rounded-sm bg-contribution-level-1"></div>
                    <div className="w-3 h-3 rounded-sm bg-contribution-level-2"></div>
                    <div className="w-3 h-3 rounded-sm bg-contribution-level-3"></div>
                    <div className="w-3 h-3 rounded-sm bg-contribution-level-4"></div>
                    <span>More</span>
                </div>
            </div>
        </TooltipProvider>
    );
};

export default GitHubActivity;
