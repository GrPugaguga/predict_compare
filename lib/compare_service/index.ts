import { ManifoldService } from './manifold/index';
import { PolymarketService } from './polymarket/index';
import { KalshiService } from './kalshi/index';
import { MarketEvent, resultType } from './dto';


export class ComparisonService {
    private manifoldService: ManifoldService;
    private polymarketService: PolymarketService;
    private kalshiService: KalshiService;

    constructor() {
        this.manifoldService = new ManifoldService();
        this.polymarketService = new PolymarketService();
        this.kalshiService = new KalshiService();
    }

    getManifoldService(): ManifoldService {
        return this.manifoldService;
    }
    getPolymarketService(): PolymarketService {
        return this.polymarketService;
    }
    getKalshiService(): KalshiService {
        return this.kalshiService;
    }

    async getKalshi(type: resultType, q?: string): Promise<MarketEvent[]> {
        try {
            let events;
            if (type === 'query' && q) {
                events = await this.kalshiService.search(q);
            } else {
                events = await this.kalshiService.getTrends();
            }
            return events.current_page.map(event => ({
                platform: 'kalshi',
                title: event.event_title,
                link: this.kalshiService.getLink(event.series_ticker, event.series_title , event.event_ticker),
                image: event.product_metadata.custom_image_url || '',
                volume: event.total_volume,
                endDate: event.event_subtitle,
                markets: event.markets.map(market => ({
                    title: market.yes_subtitle,
                    YES: market.last_price
                }))
            }));
        } catch (err) {
            console.error("Error fetching Kalshi data:", err);
            return [];
        }
    }

    async getManifold(type: resultType, q?: string): Promise<MarketEvent[]> {
        try {
            let events;
            if (type === 'query' && q) {
                events = await this.manifoldService.search(q);
            } else {
                events = await this.manifoldService.getTrends();
            }
            return events.map(event => ({
                platform: 'manifold',
                title: event.question,
                link: this.manifoldService.getLink(event.slug, event.creatorUsername),
                image: event.creatorAvatarUrl || '',
                volume: event.volume,
                endDate: new Date(event.closeTime).toISOString(),
                markets: event.mechanism === 'cpmm-1' ? [{
                    title: event.question,
                    YES: event.prob * 100
                }] : event.answers.map(answer => ({
                    title: answer.text,
                    YES: answer.prob * 100
                }))
            }));
        } catch (err) {
            console.error("Error fetching Manifold data:", err);
            return [];
        }
    }

    async getPolymarket(type: resultType, q?: string): Promise<MarketEvent[]> {
        try {
            let events;
            if (type === 'query' && q) {
                const searchResult = await this.polymarketService.search(q);
                events = searchResult.events;
            } else {
                const trendsResult = await this.polymarketService.getTrends();
                events = trendsResult.data;
            }
            return events.map(event => ({
                platform: 'polymarket',
                title: event.title,
                link: this.polymarketService.getLink(event.ticker),
                image: event.image,
                volume: event.volume,
                endDate: event.endDate,
                markets: event.markets
                .sort((a,b) => b.volume - a.volume)
                .map(market => ({
                    title: market.question,
                    YES: market.bestAsk * 100
                }))
            }));
        } catch (err) {
            console.error("Error fetching Polymarket data:", err);
            return [];
        }
    }

    async getTrends(): Promise<MarketEvent[]> {
        try {
            const resultsFromAllServices = await Promise.all([
                this.getKalshi('trends'),
                this.getManifold('trends'),
                this.getPolymarket('trends')
            ]);
            return resultsFromAllServices.flatMap(platformResults => platformResults.slice(0, 16));
        } catch (error) {
            console.error("Error fetching trends:", error);
            return [];
        }
    }

    async search(query: string): Promise<MarketEvent[]> {
        try {
            const resultsFromAllServices = await Promise.all([
                this.getKalshi('query', query),
                this.getManifold('query', query),
                this.getPolymarket('query', query)
            ]);
            return resultsFromAllServices.flatMap(platformResults => platformResults.slice(0, 1));
        } catch (error) {
            console.error(`Error searching for "${query}":`, error);
            return [];
        }
    }
}


// async function main(){
//     const comparisonService = new ComparisonService();
//     const trends = await comparisonService.search('What will be the top AI model in November 2025?');
//     console.log("Trends:", trends);
// }

// main();