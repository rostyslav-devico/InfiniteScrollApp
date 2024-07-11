import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import Header from '../../components/common/Header'
import ItemCard from '../../components/home/ItemCard'
import { Item } from '../../types/item-type'
import debounce from 'lodash.debounce'
import { API_ENDPOINTS, QueryLimit } from '../../constants/index'
import { fetchFromApi } from '../../services/photosApi'

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState<Item[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [noMoreRecords, setNoMoreRecords] = useState(false)

  const handleScroll = useCallback(() => {
    const spaceLeftToScroll =
      Math.ceil(window.innerHeight + window.scrollY) <
      Math.floor(document.documentElement.scrollHeight)

    if (spaceLeftToScroll || loading) return
    setPage(prevPage => prevPage + 1)
  }, [loading])

  const debouncedHandleScroll = debounce(handleScroll, 20)

  const loadData = useCallback(async (pageToLoad: number, search: string) => {
    setLoading(true)
    setNoMoreRecords(false)
    const controller = new AbortController()
    const response = (
      await fetchFromApi<Item[]>(controller.signal, API_ENDPOINTS.photos, {
        _page: pageToLoad,
        _limit: QueryLimit,
        q: search,
      })
    ).data
    if (!response) return
    if (response.length < QueryLimit) {
      setNoMoreRecords(true)
    }
    if (pageToLoad === 1) {
      setData(response)
    } else {
      setData(prev => [...prev, ...response!])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (page === 1) return
    setPage(1)
  }, [searchQuery])

  useEffect(() => {
    loadData(page, searchQuery)
  }, [page, searchQuery, loadData])

  useEffect(() => {
    window.addEventListener('scroll', debouncedHandleScroll)
    return () => window.removeEventListener('scroll', debouncedHandleScroll)
  }, [debouncedHandleScroll])

  return (
    <>
      <Header Query={searchQuery} onSearch={setSearchQuery} type="Home" />
      <Container>
        {Array.isArray(data) && data.map(item => <ItemCard key={item.id} item={item} />)}
      </Container>
      <LoadingContainer>
        {loading && <p>Loading...</p>}
        {noMoreRecords && (data.length > 0 ? <p>No more records</p> : <p>No items found</p>)}
      </LoadingContainer>
    </>
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

export default HomePage
