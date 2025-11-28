interface Market{
    title: string;
    YES: number;
}


export interface MarketEvent{
    platform: 'manifold' | 'polymarket' | 'kalshi';
    title: string;
    link: string;
    image: string;
    volume: number;
    endDate: string;
    markets: Market[];
}

export type resultType = 'trends' | 'query';