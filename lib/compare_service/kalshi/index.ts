import axios from 'axios';
import {SearchResult} from './dto/search_result';



export class KalshiService {
    private readonly baseUrl: string= 'https://api.elections.kalshi.com/v1/search/series';

    async search(q:string) : Promise<SearchResult> {
        const res = await axios.get(`${this.baseUrl}?query=${q}&order_by=querymatch&page_size=20&fuzzy_threshold=4&with_milestones=true&status=open`)
        return res.data
    }

    async getTrends() : Promise<SearchResult> {
        const res = await axios.get(`${this.baseUrl}?order_by=trending&page_size=20&status=open&with_milestones=true`)
        return res.data
    }

    getLink(series_ticker:string, series_title:string, event_ticker:string) : string {
        return `https://kalshi.com/markets/${series_ticker.toLowerCase()}/${series_title.toLowerCase().replace(/ /g, "-")}/${event_ticker.toLowerCase()}`
    }
}
