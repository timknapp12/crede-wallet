import {
  QueryClient,
  QueryClientProvider as QueryClientProviderBase,
} from '@tanstack/react-query'
import PropTypes from 'prop-types'

const CACHE_TIME = 1000 * 60 * 60 * 24 // 1 day

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000, // 10 minutes
      cacheTime: CACHE_TIME,
      retry: 1,
    },
  },
})

export function QueryClientProvider({ children }) {
  return (
    <QueryClientProviderBase client={queryClient}>{children}</QueryClientProviderBase>
  )
}

QueryClientProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
