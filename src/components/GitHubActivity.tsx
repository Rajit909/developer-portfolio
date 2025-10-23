
"use client";

import React, { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const WEEKS = 53;
const DAYS_IN_WEEK = 7;
const TOTAL_DAYS = WEEKS * DAYS_IN_WEEK;

// This function generates placeholder contribution data for the past year.
const generateActivityData = () => {
    const data = Array.from({ length: TOTAL_DAYS }, (_, i) => {
        const today = new Date();
        const date = new Date(today);
        date.setDate(today.getDate() - (TOTAL_DAYS - 1 - i));
        
        // Default to level 0 (no contributions)
        const level = 0;

        return {
            date: date.toISOString().split('T')[0],
            level,
            contributions: 0
        };
    });
    return data;
};

// This function calculates the labels for the months.
const getMonthLabels = () => {
    const labels: { month: string; week: number }[] = [];
    const today = new Date();
    // Start from the beginning of the activity grid's date range
    let currentDate = new Date(today);
    currentDate.setDate(today.getDate() - TOTAL_DAYS + 1);
    
    // Add the first month
    labels.push({ month: currentDate.toLocaleString('default', { month: 'short' }), week: 0 });

    for (let i = 1; i < WEEKS; i++) {
        const lastDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 7); // Move to the next week
        // If the month changes, add a new label
        if(currentDate.getMonth() !== lastDate.getMonth()) {
            labels.push({ month: currentDate.toLocaleString('default', { month: 'short' }), week: i });
        }
    }
    return labels;
}

const GitHubActivity = () => {
    // We use state to ensure this part of the component only runs on the client.
    const [activityData, setActivityData] = useState<any[]>([]);
    const [monthLabels, setMonthLabels] = useState<{ month: string, week: number }[]>([]);

    useEffect(() => {
        // In a real implementation, you would fetch data from the GitHub API here.
        // For now, we are using generated placeholder data.
        setActivityData(generateActivityData());
        setMonthLabels(getMonthLabels());
    }, []);

    // Display a placeholder while the client-side data is being generated.
    if (activityData.length === 0) {
        return <div className="p-4 border rounded-lg bg-card text-card-foreground h-[138px] animate-pulse w-full max-w-fit mx-auto"></div>;
    }
    
    const grid = Array.from({ length: DAYS_IN_WEEK }, () => Array(WEEKS).fill(null));
    
    // This logic places each day's data into the correct grid cell.
    const firstDay = new Date(activityData[0].date).getDay();
    activityData.forEach((day, index) => {
        const dayOfWeek = (firstDay + index) % DAYS_IN_WEEK;
        const week = Math.floor((firstDay + index) / DAYS_IN_WEEK);
        if (week < WEEKS && dayOfWeek < DAYS_IN_WEEK) {
            grid[dayOfWeek][week] = day;
        }
    });

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <TooltipProvider>
            <div className="p-4 border rounded-lg bg-card text-card-foreground overflow-x-auto max-w-fit mx-auto">
                <div className="flex flex-col items-start">
                    <div className="relative w-full h-5 mb-1">
                        {monthLabels.map(({ month, week }) => (
                            <div key={`${month}-${week}`} className="text-xs text-muted-foreground absolute" style={{ left: `${(week * 16)}px` }}>
                                {month}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <div className="grid grid-rows-7 gap-1 text-xs text-muted-foreground pr-1">
                            {dayLabels.map((day, i) => (
                                <div key={day} className="h-3 leading-none mt-px" style={{ visibility: i % 2 !== 0 ? 'visible' : 'hidden' }}>{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-53 grid-rows-7 gap-1">
                            {grid.flat().map((day, index) => (
                                <Tooltip key={index} delayDuration={100}>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="w-3 h-3 rounded-full"
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
                     <div className="flex justify-end items-center gap-2 mt-2 text-xs text-muted-foreground w-full">
                        <span>Less</span>
                        <div className="w-3 h-3 rounded-full bg-[--contribution-level-0]"></div>
                        <div className="w-3 h-3 rounded-full bg-[--contribution-level-1]"></div>
                        <div className="w-3 h-3 rounded-full bg-[--contribution-level-2]"></div>
                        <div className="w-3 h-3 rounded-full bg-[--contribution-level-3]"></div>
                        <div className="w-3 h-3 rounded-full bg-[--contribution-level-4]"></div>
                        <span>More</span>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
};

export default GitHubActivity;
