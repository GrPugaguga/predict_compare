import { NextResponse, type NextRequest } from 'next/server';
import { ComparisonService } from '@/lib/compare_service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ message: 'Query parameter "q" is required' }, { status: 400 });
    }

    const comparisonService = new ComparisonService();
    const results = await comparisonService.search(query);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
