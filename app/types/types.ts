
export type PotStatus = "open" | "closed" | "settled";

export interface Pot {
    id: number;
    name: string;
    description: string;
    distribution_rule: string;
    type: string;
    entry_fee: number;
    end_time: string;
    status: PotStatus;
    start_time: string;
    is_joined: boolean
    created_at: any
    participants_count: number
    total_amount: number
}

export interface LinePotFoot {
    id: number;
    home_name: string;
    away_name: string;
    result: string;
    team_home_fav: boolean;
    team_away_fav: boolean;
    team_home_logo: string;
    team_home: string;
    score_home: number
    team_away_logo: string
    team_away: string
    score_away: number
    points: number
    prediction: string;
    fixture: {
        favorite: string
        team_home_logo: string;
        team_home_name: string;
        score_home: number
        team_away_logo: string
        team_away_name: string
        score_away: number
    }
}