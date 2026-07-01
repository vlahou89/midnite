export interface Contract {
  id: number
  odds: string
  team: 'home' | 'away'
}

export interface Match {
  home_team: string
  home_score: string | null
  home_image_url: string | null
  away_team: string
  away_score: string | null
  away_image_url: string | null
  game_id: number
  game_name: string
  contracts: Contract[]
  game_image_key: string
  match_id: number
}

export interface GameInfo {
  name: string
  imageKey: string
  matchCount: number
}

export interface InPlayContainer {
  type: 'in-play'
  matches: Match[]
}

export interface CarouselSlide {
  title: string
  link: string
  banner: string
  terms: string
}

export interface CarouselContainer {
  type: 'carousel'
  slides: CarouselSlide[]
}

export type ApiContainer = InPlayContainer | CarouselContainer
