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
    upsertGame(state, action: PayloadAction<Game>) {
      const incomingGame = action.payload
      const index = state.games.findIndex(game => game.id === incomingGame.id)
      if (index >= 0) {
        state.games[index] = incomingGame
      } else {
        state.games.push(incomingGame)
      }
    },
    resetGames(state) {
      state.games = []
    },
  },
})

export const { setGames, upsertGame, resetGames } = gamesSlice.actions

export default gamesSlice.reducer

