import backendBaseApi from '../backendBaseApi'
import { endPoints } from '../endPoints'
import { setCategories } from '../../store/slices/categoriesSlice'

export type Category = {
  id: number
  name: string
  slug?: string | null
  description?: string | null
}

type CategoriesApiResponse =
  | Category[]
  | {
      results?: Category[]
      data?: Category[]
      categories?: Category[]
    }

const categoriesApi = backendBaseApi.injectEndpoints({
  endpoints: build => ({
    getCategories: build.query<Category[], void>({
      query: () => ({
        url: endPoints.categories,
        method: 'GET',
      }),
      transformResponse: (response: CategoriesApiResponse) => {
        if (Array.isArray(response)) {
          return response
        }

        const collections = [
          response?.results,
          response?.data,
          response?.categories,
        ].find(
          (collection): collection is Category[] =>
            Array.isArray(collection),
        )
        return collections ?? []
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCategories(data))
        } catch (error) {
          console.warn('Failed to preload categories:', error)
        }
      },
    }),
  }),
  overrideExisting: true,
})

export const { useGetCategoriesQuery } = categoriesApi

export default categoriesApi

