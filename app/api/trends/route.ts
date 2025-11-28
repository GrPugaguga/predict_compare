import { NextResponse } from 'next/server';
import { ComparisonService } from '@/lib/compare_service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const comparisonService = new ComparisonService();
    const trends = await comparisonService.getTrends();
    return NextResponse.json(trends);
  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
