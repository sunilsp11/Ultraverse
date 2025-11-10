import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Category } from '../../services/categories/categoriesApi'

export type CategoriesState = {
  categories: Category[]
}

const initialState: CategoriesState = {
  categories: [],
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload
    },
    resetCategories(state) {
      state.categories = []
    },
  },
})

export const { setCategories, resetCategories } = categoriesSlice.actions

export default categoriesSlice.reducer

