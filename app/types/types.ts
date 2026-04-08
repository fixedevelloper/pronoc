
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
// types/fixture.ts
export interface FixtureBase {
    id: number
    fixture_id: string
    referee: string | null
    timezone: string
    timestamp: number
    date: string
    st_long: string
    st_short: string
    st_elapsed: number | null
    league_id: number
    team_home_logo: string | null
    team_away_logo: string | null
    day_timestamp: number | null
    team_home_name: string
    team_away_name: string
    team_away_winner: boolean
    team_home_winner: boolean
    goal_home: number | null
    goal_away: number | null
    score_ht_home: number | null
    score_ht_away: number | null
    score_ft_home: number | null
    score_ft_away: number | null
    score_ext_home: number | null
    score_ext_away: number | null
    score_pt_home: number | null
    score_pt_away: number | null
    created_at: string
    updated_at: string
}

export interface Fixture extends FixtureBase {
    league?: LeagueMinimal
    aiPrediction?: AiPrediction
    linePotFoot?: LinePotFoot[]
}

// Minimal pour listes
export interface FixtureMinimal {
    id: number
    fixture_id: string
    date: string
    team_home_name: string
    team_away_name: string
    team_home_logo: string | null
    team_away_logo: string | null
    league_id: number
    st_short: string
    goal_home: number | null
    goal_away: number | null
}

// Response API complète
export interface FixtureResource {
    id: number
    fixture_id: string
    date: string
    timestamp: number
    timezone: string
    referee: string | null
    home_team: TeamScore
    away_team: TeamScore
    league?: LeagueMinimal
    status: {
        elapsed: number | null
        long: string
        short: string
    }
    ai_prediction?: {
        home_score: number
        away_score: number
        confidence: number
        analysis: string | null
    }
    //lineups?: LinePotFootResource[]
    day_timestamp: number | null
    created_at: string
    updated_at: string
}

// Équipe avec scores
export interface TeamScore {
    name: string
    logo: string | null
    winner: boolean
    goals: {
        total: number | null
        ht: number | null
        ft: number | null
        et: number | null
        pt: number | null
    }
}

// League minimale
export interface LeagueMinimal {
    id: number
    name: string
    logo: string | null,
    country_code: string | null
}

// AI Prediction
export interface AiPrediction {
    id: number
    fixture_id: number
    home_score: number
    away_score: number
    confidence: number
    analysis: string | null
    created_at: string
}

// Lineup simplifiée
export interface LinePotFoot {
    id: number
    fixture_id: number
    player_name: string
    position: string
    team: string
}
export interface MatchAnalysis {
    id: string
    home_team: string
    home_logo: string| null;
    away_team: string
    away_logo: string| null;
    league: string
    league_logo: string
    time: string
    locked: boolean
    price: number
}
// Response collection
export interface FixtureCollection {
    data: FixtureResource[]
    meta: {
        total: number
        per_page: number
        current_page: number
    }
}