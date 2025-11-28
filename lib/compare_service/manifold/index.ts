import axios from 'axios';
import {Market} from './dto/search_result';


export class ManifoldService {
    private readonly baseUrl: string= 'https://api.manifold.markets/search-markets-full';

    async search(q:string) : Promise<Market[]> {
        const res = await axios.get(`${this.baseUrl}?term=${q}+&filter=all&sort=score&contractType=ALL&offset=0&limit=20&isPrizeMarket=0&forYou=0&token=MANA&gids=&hasBets=0`)
        return res.data
    }

    async getTrends() : Promise<Market[]> {
        const res = await axios.get(`${this.baseUrl}?term=&filter=all&sort=score&contractType=ALL&offset=0&limit=20&isPrizeMarket=0&forYou=0&token=MANA&gids=&hasBets=0`)
        return res.data
    }

    getLink(slug:string, creatorUsername:string) : string {
        return `https://manifold.markets/${creatorUsername}/${slug}`
    }
}
