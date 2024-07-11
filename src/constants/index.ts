export const QueryLimit = 50

export const API_URL = 'https://jsonplaceholder.typicode.com'

export const API_ENDPOINTS = {
  root: API_URL,
  photos: `${API_URL}/photos`,
  photo: (id: string) => `${API_URL}/photos/${id}`,
}

export const UI_URL = {
  root: '/',
  item: `/item/:id`,
}
