import axios from 'axios';
import {SearchResult, getTrendsResponse} from './dto/search_result';


export class PolymarketService {
    private readonly baseUrl: string= 'https://gamma-api.polymarket.com';
    
    async search(q:string) : Promise<SearchResult> {
        const res = await axios.get(`${this.baseUrl}/public-search?q=${q}&active=true&archived=false&closed=false`)
        return res.data
    }

    async getTrends() : Promise<getTrendsResponse> {
        const res = await axios.get(`${this.baseUrl}/events/pagination?limit=20&active=true&archived=false&closed=false&order=volume24hr&ascending=false&offset=0`)
        return res.data
    }

    getLink(ticker:string) : string {
        return `https://polymarket.com/event/${ticker}`
    }
}
