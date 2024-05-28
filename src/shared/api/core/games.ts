import { coreApiUrl } from '@/shared/config';
import { createServerClient } from '@/shared/lib/supabase';

export type GameStoreResponse = 'steam' | 'epic';
export type GameDrmResponse = 'steam' | 'epic';

export type PriceHistoryRecordResponse = {
  id: string;
  gameId: string;
  regular: number;
  current: number;
  store: GameStoreResponse;
  datetime: string;
};

export type GetPriceHistoryResponse = {
  history: Record<GameStoreResponse, PriceHistoryRecordResponse[]>;
};

export async function getPriceHistory(
  gameId: string
): Promise<GetPriceHistoryResponse> {
  const uri = `${coreApiUrl}/games/${gameId}/price-history`;

  const response = await fetch(uri, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    // TODO: error 구체화
    throw new Error();
  }

  const data = await response.json();

  return data;
}

export type GetGamesOptions = {
  ids?: number[];
};

export type GameTypeResponse = 'game' | 'dlc' | 'bundle';

export type MetaCriticResponse = {
  metaScoreUrl: string;
  metaScore: number | null;
  userScoreUrl: string;
  userScore: number | null;
};

export type OpenCriticTierResponse = 'Mighty' | 'Strong' | 'Fair' | 'Weak';

export type OpenCriticResponse = {
  url: string;
  tier: OpenCriticTierResponse | null;
  topCriticScore: number | null;
  percentRecommended: number | null;
};

export type SteamScoreResponse = {
  url: string;
  total: number | null;
  positive: number | null;
};

export type PriceInfoResponse = {
  current: number;
  regular: number;
  lowest: number;
};

export type GameCatalogResponse = {
  id: number;
  gameId: number | null;
  url: string;
  store: GameStoreResponse;
  drm: GameDrmResponse;
  regularPrice: number | null;
  currentPrice: number | null;
  currentPriceExpireAt: string | null;
  lowestPrice: number | null;
  lowestPriceUpdatedAt: string | null;
};

export type GameResponse = {
  id: number;
  publicId: string;
  isFree: boolean;
  title: string | null;
  titleKo: string | null;
  type: GameTypeResponse;
  releaseYear: number | null;
  releaseMonth: number | null;
  releaseDay: number | null;
  mainImage: string | null;
  description: string | null;
  summary: string | null;
  baseGameId: number | null;
  tags: string[];
  screenshots: string[];
  developers: string[];
  publishers: string[];
  createdAt: string;
  metaCritic: MetaCriticResponse | null;
  openCritic: OpenCriticResponse | null;
  steamScore: SteamScoreResponse | null;
  gameCatalog: GameCatalogResponse[];
};

export type GameCatalogPreviewResponse = Pick<
  GameCatalogResponse,
  | 'id'
  | 'gameId'
  | 'store'
  | 'drm'
  | 'currentPrice'
  | 'currentPriceExpireAt'
  | 'lowestPrice'
  | 'regularPrice'
>;

export type GamePreviewResponse = Pick<
  GameResponse,
  'id' | 'publicId' | 'title' | 'titleKo' | 'type' | 'mainImage' | 'isFree'
> & {
  gameCatalog: GameCatalogPreviewResponse[];
};

export type GetGamesResponse = {
  games: GamePreviewResponse[];
};

export async function getGames({
  ids,
}: GetGamesOptions = {}): Promise<GetGamesResponse> {
  const supabase = createServerClient();

  let baseRequest = supabase.from('game').select(
    'id, publicId: public_id, title, titleKo: title_ko, type, mainImage: main_image,\
    isFree: is_free, gameCatalog: game_catalog(id, gameId: game_id, store, drm, regularPrice: regular_price,\
    currentPrice: current_price, currentPriceExpireAt: current_price_expire_at, lowestPrice: lowest_price)'
  );

  if (!!ids) {
    baseRequest = baseRequest.in('id', ids);
  }

  const { data, error } = await baseRequest;

  if (!!error) {
    throw error;
  }

  return {
    games: data,
  };
}

export type GetGameResponse = {
  game: GameResponse;
};

export async function getGame(id: string): Promise<GetGameResponse> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('game')
    .select(
      'id, publicId: public_id, title, titleKo: title_ko, type, releaseYear: release_year, releaseMonth: release_month, releaseDay: release_day, mainImage: main_image, isFree: is_free,\
      description, summary, baseGameId: base_game_id, tags, screenshots, developers, publishers, createdAt: created_at,\
      metaCritic: meta_critic(metaScoreUrl: meta_score_url, metaScore: meta_score, userScoreUrl: user_score_url, userScore: user_score),\
      openCritic: open_critic(url, tier, topCriticScore: top_critic_score, percentRecommended: percent_recommended),\
      steamScore: steam_score(url, total, positive),\
      gameCatalog: game_catalog(id, gameId: game_id, url, store, drm, regularPrice: regular_price, currentPrice: current_price, currentPriceExpireAt: current_price_expire_at, lowestPrice: lowest_price, lowestPriceUpdatedAt: lowest_price_updated_at)'
    )
    .eq('public_id', id)
    .single();

  if (!!error) {
    throw error;
  }

  return {
    game: data,
  };
}
