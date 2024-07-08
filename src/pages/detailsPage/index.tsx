import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Item } from '../../types/item-type'
import RelatedList from '../../components/detailsPage/RelatedItemsList'
import { enqueueSnackbar } from 'notistack'
import styled from 'styled-components'
import Header from '../../components/Header'

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedByAlbum, setRelatedByAlbum] = useState<Item[]>([])
  const [relatedByName, setRelatedByName] = useState<Item[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const openPopup = useCallback(() => {
    setIsPopupOpen(true)
  }, [])

  const closePopup = useCallback(() => {
    setIsPopupOpen(false)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    const fetchItem = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/photos/${id}`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const result = await response.json()
        setItem(result)
        fetchRelatedItems(result, controller.signal)
        setLoading(false)
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message)
          enqueueSnackbar(err.message, { variant: 'error' })
          setLoading(false)
        }
      }
    }

    const fetchRelatedItems = async (item: Item, signal: AbortSignal) => {
      try {
        const albumResponse = await fetch(
          `https://jsonplaceholder.typicode.com/photos?albumId=${item.albumId}&_limit=10`,
          { signal },
        )
        const nameResponse = await fetch(
          `https://jsonplaceholder.typicode.com/photos?title_like=${item.title.split(' ')[0]}&_limit=10`,
          { signal },
        )
        if (!albumResponse.ok || !nameResponse.ok) {
          throw new Error('Network response was not ok')
        }
        const albumResult = await albumResponse.json()
        const nameResult = await nameResponse.json()
        setRelatedByAlbum(albumResult.filter((i: Item) => i.id !== item.id))
        setRelatedByName(nameResult.filter((i: Item) => i.id !== item.id))
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          enqueueSnackbar(err.message, { variant: 'error' })
          setError(err.message)
        }
      }
    }

    fetchItem()

    return () => {
      controller.abort()
    }
  }, [id])

  if (loading) return <p className="text-gray-300">Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <>
      <Header type="Details" />
      <Container>
        {item && (
          <>
            <ItemContainer>
              <ItemDetails>
                <ItemImage src={item.url} alt={item.title} onClick={openPopup} />
                <div className="flex flex-col items-start">
                  <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
                  <p className="text-lg text-gray-400">{`Album ID: ${item.albumId}`}</p>
                  <p className="text-lg text-gray-400">{`Photo ID: ${item.id}`}</p>
                </div>
              </ItemDetails>
            </ItemContainer>
            <RelatedItemsContainer>
              <RelatedList items={relatedByAlbum} title="Related by Album" />
              <RelatedList items={relatedByName} title="Related by Name" />
            </RelatedItemsContainer>
            {isPopupOpen && (
              <ImagePopup onClick={closePopup}>
                <img
                  src={item.url}
                  alt={item.title}
                  className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-xl"
                />
              </ImagePopup>
            )}
          </>
        )}
      </Container>
    </>
  )
}

export default ItemDetail

const Container = styled.div`
  min-height: 100vh;
  background-color: #1f2228;
  color: #ffffff;
  padding: 32px;
  padding-top: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ItemContainer = styled.div`
  max-width: 1024px;
  width: 100%;
  background-color: #282c34;
  border: 2px solid #636363;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
`

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`

const ItemImage = styled.img`
  width: 100%;
  max-width: 400px;
  border-radius: 4px;
  margin-bottom: 16px;
  cursor: pointer;

  @media (min-width: 768px) {
    width: 25%;
    margin-bottom: 0;
    margin-right: 24px;
  }
`

const RelatedItemsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const ImagePopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`
