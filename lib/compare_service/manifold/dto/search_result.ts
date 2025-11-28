/**Рынок поискового ответа от api manifold */

export interface Market {
    id: string;
    question: string;
    description: string;
    creatorUsername: string;
    slug: string;
    creatorAvatarUrl: string;
    volume: number;
    startDate: string;
    closeTime: string;
    mechanism: "cpmm-1"|"cpmm-multi-1"
    /*pool при  mechanism cpmm-1*/
    prob: number;
    pool: {
        "YES": number;
        "NO": number;
    }
    /*answers при mechanism cpmm-multi-1*/
    answers: {
        id: string;
        text: string;
        poolNo: number;
        poolYes: number;
        prob: number;
        volume: number;
    }[]; 
}