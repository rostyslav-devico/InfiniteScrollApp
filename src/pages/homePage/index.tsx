import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import Header from '../../components/Header'
import ItemCard from '../../components/home/ItemCard'
import { Item } from '../../types/item-type'
import { enqueueSnackbar } from 'notistack'
import debounce from 'lodash.debounce'

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState<Item[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleScroll = useCallback(() => {
    if (
      document.documentElement.scrollHeight - (window.innerHeight + window.scrollY) > 0 ||
      loading
    )
      return
    setPage(prevPage => prevPage + 1)
  }, [loading])

  const debouncedHandleScroll = debounce(handleScroll, 10)

  const loadData = useCallback(
    async (controller: AbortController) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=50&q=${searchQuery}`,
          {
            signal: controller.signal,
          },
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const result = await response.json()
        setData(prev => [...prev, ...result])
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          enqueueSnackbar(err.message, { variant: 'error' })
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    },
    [page, searchQuery],
  )

  useEffect(() => {
    setData([])
    setPage(1)
  }, [searchQuery])

  useEffect(() => {
    const controller = new AbortController()
    loadData(controller)

    return () => {
      controller.abort()
    }
  }, [page, searchQuery, loadData])

  useEffect(() => {
    window.addEventListener('scroll', debouncedHandleScroll)
    return () => window.removeEventListener('scroll', debouncedHandleScroll)
  }, [debouncedHandleScroll])

  return (
    <div>
      <Header searchQuery={searchQuery} onSearch={setSearchQuery} type="Home" />
      <Container>
        {data.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </Container>
      <LoadingContainer>
        {loading && page < 100 && !error && <p>Loading...</p>}
        {error && (
          <ErrorContainer>
            <p>{error}</p>
            <RefetchButton
              onClick={() => {
                const controller = new AbortController()
                loadData(controller)
              }}
            >
              Refetch
            </RefetchButton>
          </ErrorContainer>
        )}
        {!loading && !error && data.length === 0 && <p>No items found</p>}
        {page == 100 && data.length > 0 && (
          <NoMoreRecordsMessage className="">No more records</NoMoreRecordsMessage>
        )}
      </LoadingContainer>
    </div>
  )
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 96px;
  padding-left: 20px;
  padding-right: 20px;

  @media (min-width: 768px) {
    padding-left: 50px;
    padding-right: 50px;
  }
`

const LoadingContainer = styled.div`
  width: 100%;
  height: 96px;
  background-color: #282c34;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 24px;
  color: #e6e6e6;
  font-weight: 500;
`

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const RefetchButton = styled.button`
  margin-left: 16px;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #3c4147;
  color: #e6e6e6;
  font-size: 16px;
  border: none;
  outline: none;
  cursor: pointer;
`

const NoMoreRecordsMessage = styled.p`
  @keyframes fadeIn {
    0% {
      visibility: hidden;
      opacity: 0;
    }
    50% {
      visibility: visible;
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  animation: fadeIn 2s ease-in-out;
`

export default HomePage
