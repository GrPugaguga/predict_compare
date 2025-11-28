/**Рынок поискового ответа от api kalshi */
export interface Market {
    last_price: number;
    close_ts: string;
    open_ts: string;
    yes_subtitle: string;
}

interface SearchResultEvent {
    event_title: string;
    event_ticker: string;
    series_ticker: string;
    series_title: string;
    is_closing: boolean;
    event_subtitle: string;
    total_volume: number;
    product_metadata: {
        custom_image_url?: string;
    };
    markets: Market[];
}


export interface SearchResult {
    current_page: SearchResultEvent[];
    next_cursor: string;
    total_results_count: number;
}