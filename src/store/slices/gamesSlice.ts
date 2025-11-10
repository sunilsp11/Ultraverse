import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Game } from '../../services/games/gamesApi'

export type GamesState = {
  games: Game[]
}

const initialState: GamesState = {
  games: [],
}

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setGames(state, action: PayloadAction<Game[]>) {
      state.games = action.payload
    },
    resetGames(state) {
      state.games = []
    },
  },
})

export const { setGames, resetGames } = gamesSlice.actions

export default gamesSlice.reducer

