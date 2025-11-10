import backendBaseApi from '../backendBaseApi'
import { endPoints } from '../endPoints'
import { setGames } from '../../store/slices/gamesSlice'

export type GameCategory = {
  id: number
  name: string
  description?: string | null
  created_at?: string
  updated_at?: string
}

export type GamePublisher = {
  id: number
  name: string
  website?: string | null
  description?: string | null
  created_at?: string
  updated_at?: string
}

export type Game = {
  id: number
  name: string
  categories?: GameCategory[]
  short_description?: string | null
  description?: string | null
  release_date?: string | null
  publisher?: GamePublisher | null
  primary_image?: string | null
  created_at?: string
  updated_at?: string
}

type GamesApiResponse =
  | Game[]
  | {
      results?: Game[]
      data?: Game[]
      games?: Game[]
    }

const extractGamesCollection = (response: GamesApiResponse): Game[] => {
  if (Array.isArray(response)) {
    return response
  }

  const collections = [
    response?.results,
    response?.data,
    response?.games,
  ].find(
    (collection): collection is Game[] =>
      Array.isArray(collection),
  )

  return collections ?? []
}

const gamesApi = backendBaseApi.injectEndpoints({
  endpoints: build => ({
    getTopGames: build.query<Game[], void>({
      query: () => ({
        url: endPoints.games,
        method: 'GET',
      }),
      transformResponse: (response: GamesApiResponse) => extractGamesCollection(response),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setGames(data))
        } catch (error) {
       console.log('error', error)
        }
      },
    }),
  }),
  overrideExisting: true,
})

export const { useGetTopGamesQuery } = gamesApi

export default gamesApi

