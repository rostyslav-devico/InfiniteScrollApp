import { enqueueSnackbar } from 'notistack'
import qs from 'qs'

interface IResponse<T> {
  status: number
  data?: T
  error?: string
}

export const fetchFromApi = async <T>(
  signal: AbortSignal,
  endpoint: string,
  params?: any,
): Promise<IResponse<T>> => {
  let url = endpoint

  if (params) {
    if (typeof params === 'object') {
      url += `?${qs.stringify(params, { encode: false })}`
    } else if (typeof params === 'string') {
      url += `?${params}`
    }
  }

  const options: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  }

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const payload = await response.json()
    return {
      status: response.status,
      data: payload as T,
    }
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === 'AbortError') {
        return {
          status: 500,
          data: undefined,
          error: 'AbortError',
        }
      } else {
        enqueueSnackbar(error.message, { variant: 'error' })
        return {
          status: 500,
          data: undefined,
          error: error.message,
        }
      }
    }
    if (error instanceof Error) {
      enqueueSnackbar(error.message, { variant: 'error' })
      return {
        status: 500,
        data: undefined,
        error: error.message,
      }
    } else {
      enqueueSnackbar('An unknown error occurred', { variant: 'error' })
      return {
        status: 500,
        data: undefined,
        error: 'An unknown error occurred',
      }
    }
  }
}
