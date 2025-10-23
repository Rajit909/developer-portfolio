
import { NextResponse } from 'next/server';

export async function GET() {
    const GITHUB_USERNAME = 'rajit909';
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    if (!GITHUB_TOKEN) {
        return NextResponse.json({ error: 'GitHub token is not configured.' }, { status: 500 });
    }

    const query = `
      query($userName: String!) {
        user(login: $userName) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  color
                }
              }
            }
          }
        }
      }
    `;

    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: { userName: GITHUB_USERNAME },
            }),
             // Re-fetch data every hour
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('GitHub API response not OK:', response.status, errorBody);
            throw new Error(`GitHub API responded with ${response.status}`);
        }

        const data = await response.json();

        if (data.errors) {
            console.error('GitHub API returned errors:', data.errors);
            throw new Error(data.errors.map((e:any) => e.message).join(', '));
        }

        const contributionData = data.data.user.contributionsCollection.contributionCalendar;

        return NextResponse.json({
            totalContributions: contributionData.totalContributions,
            weeks: contributionData.weeks,
        });

    } catch (error: any) {
        console.error('Failed to fetch GitHub activity:', error);
        return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}
