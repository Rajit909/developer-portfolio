
"use client";

import React, { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

const WEEKS = 53;
const DAYS_IN_WEEK = 7;

interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

interface Week {
  contributionDays: ContributionDay[];
}

interface ContributionData {
  totalContributions: number;
  weeks: Week[];
}

const getMonthLabels = (weeks: Week[]) => {
    const labels: { month: string; week: number }[] = [];
    if (!weeks || weeks.length === 0) return labels;

    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
        const firstDayOfMonth = week.contributionDays.find(day => {
            const date = new Date(day.date);
            const dayOfMonth = date.getDate();
            const month = date.getMonth();
            return dayOfMonth <= 7 && month !== lastMonth;
        });

        if (firstDayOfMonth) {
            const date = new Date(firstDayOfMonth.date);
            const month = date.getMonth();
            if (month !== lastMonth) {
                labels.push({
                    month: date.toLocaleString('default', { month: 'short' }),
                    week: weekIndex,
                });
                lastMonth = month;
            }
        }
    });

    return labels;
}

const GitHubActivity = () => {
    const [activityData, setActivityData] = useState<ContributionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [monthLabels, setMonthLabels] = useState<{ month: string, week: number }[]>([]);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await fetch('/api/github-activity');
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Failed to fetch GitHub activity');
                }
                const data: ContributionData = await res.json();
                setActivityData(data);
                setMonthLabels(getMonthLabels(data.weeks));
            } catch (err: any) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, []);

    if (loading) {
        return <div className="p-4 border rounded-lg bg-card text-card-foreground h-[138px] w-full max-w-fit mx-auto"><Skeleton className="h-full w-full" /></div>;
    }

    if (error) {
        return (
            <div className="p-4 border rounded-lg bg-destructive/10 text-destructive-foreground max-w-fit mx-auto text-center">
                <p className="font-bold">Error loading GitHub activity</p>
                <p className="text-xs">{error}</p>
                <p className="text-xs mt-2">Please ensure your GITHUB_TOKEN is set correctly in a `.env.local` file.</p>
            </div>
        );
    }
    
    if (!activityData) {
        return null;
    }

    const grid = Array.from({ length: DAYS_IN_WEEK }, () => Array(WEEKS).fill(null));
    activityData.weeks.forEach((week, weekIndex) => {
        week.contributionDays.forEach(day => {
            const dayOfWeek = new Date(day.date).getDay();
            grid[dayOfWeek][weekIndex] = day;
        });
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
                            {Array.from({ length: WEEKS * DAYS_IN_WEEK }).map((_, index) => {
                                const weekIndex = Math.floor(index / DAYS_IN_WEEK);
                                const dayIndex = index % DAYS_IN_WEEK;
                                const day = grid[dayIndex]?.[weekIndex];

                                return (
                                    <Tooltip key={index} delayDuration={100}>
                                        <TooltipTrigger asChild>
                                            <div
                                                className="w-3 h-3 rounded-[2px]"
                                                style={{ backgroundColor: day?.color ?? 'var(--contribution-level-0)' }}
                                            ></div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">
                                                {day ? `${day.contributionCount} contributions on ${new Date(day.date).toDateString()}` : 'No contributions'}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    </div>
                     <div className="flex justify-end items-center gap-2 mt-2 text-xs text-muted-foreground w-full">
                        <span>Less</span>
                        <div className="w-3 h-3 rounded-[2px] bg-[--contribution-level-0]"></div>
                        <div className="w-3 h-3 rounded-[2px] bg-[--contribution-level-1]"></div>
                        <div className="w-3 h-3 rounded-[2px] bg-[--contribution-level-2]"></div>
                        <div className="w-3 h-3 rounded-[2px] bg-[--contribution-level-3]"></div>
                        <div className="w-3 h-3 rounded-[2px] bg-[--contribution-level-4]"></div>
                        <span>More</span>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
};

export default GitHubActivity;
