// types/AiPredictionResource.ts

import {FixtureMinimal, FixtureResource} from "./types";

export interface AiPredictionDetails {
    home_win_prob?: number
    draw_prob?: number
    away_win_prob?: number
    over_1_5?: number
    over_2_5?: number
    over_3_5?: number
    under_2_5?: number
    btts_yes?: number
    btts_no?: number
    odds_home?: number
    odds_draw?: number
    odds_away?: number
    odds_over_2_5?: number
    odds_under_2_5?: number
    best_bets?: any // peut être tableau ou objet selon ton backend
}

export interface AiPredictionStats {
    real_score?: string
    is_score_correct?: boolean
    is_1x2_correct?: boolean
    is_over25_correct?: boolean
    is_btts_correct?: boolean
    accuracy_score?: number
}

export interface AiPredictionResource {
    id: number
    fixture_id: number
    match_name: string
    source: string
    analyse_fixture: string
    score_exact?: string
    confidence?: number
    raw_response?: any
    predicted_at: string
    created_at: string
    updated_at: string

    // Relations
    fixture?:FixtureMinimal
    details?: AiPredictionDetails
    stats?: AiPredictionStats
}
export interface AiPredictionCollection {
    data: AiPredictionResource[]
    meta: {
        total: number
        per_page: number
        current_page: number
    }
}