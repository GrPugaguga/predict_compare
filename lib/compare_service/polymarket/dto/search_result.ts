/**Рынок поискового ответа от api polymarket */
interface Market {
    id: string;
    question: string;
    description: string;
    image: string;
    volume: number;
    startDate: string;
    endDate: string;
    outcomes: string[];
    outcomePrices: string[];
    bestAsk: number;
}

/**Тег события поискового ответа от api polymarket */
interface EventTag {
    id: string;
    label: string; 
}

/**События поискового ответа от api polymarket */
interface SearchResultEvent {
    id: string;
    active: boolean;
    image: string;
    description: string;
    title: string;
    ticker: string;
    volume: number;
    endDate: string;
    tags: EventTag[]
    markets: Market[];
}

/**Результат поискового ответа от api polymarket */
export interface SearchResult {
    events: SearchResultEvent[];
}

/**Первая страница от api polymarket */
export interface getTrendsResponse {
    data: SearchResultEvent[];
}