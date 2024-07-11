import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Item } from '../../types/item-type'
import RelatedList from '../../components/detailsPage/RelatedItemsList'
import styled from 'styled-components'
import Header from '../../components/common/Header'
import { fetchFromApi } from '../../services/photosApi'
import { DataContext } from '../../services/DataContext'
import Image from '../../components/common/Image'
import { API_ENDPOINTS, UI_URL } from '../../constants'

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedByAlbum, setRelatedByAlbum] = useState<Item[]>([])
  const [relatedByName, setRelatedByName] = useState<Item[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const { selectedItem } = useContext(DataContext)
  const navigate = useNavigate()

  const controller = useMemo(() => new AbortController(), [])
  const openPopup = useCallback(() => {
    setIsPopupOpen(true)
  }, [])

  const closePopup = useCallback(() => {
    setIsPopupOpen(false)
  }, [])

  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isPopupOpen])

  useEffect(() => {
    const signal = controller.signal
    setLoading(true)

    const fetchItem = async () => {
      if (selectedItem) {
        setItem(selectedItem)
      } else {
        const data = (await fetchFromApi<Item>(signal, API_ENDPOINTS.photo(id!))).data
        if (!data) {
          controller.abort()
          navigate(UI_URL.root)
          return
        }
        setItem(data)
      }
    }
    setLoading(false)

    fetchItem()
  }, [id, navigate, selectedItem, controller])

  useEffect(() => {
    if (!item) return
    const signal = controller.signal

    const fetchRelatedItems = async (item: Item) => {
      const [albumResult, nameResult] = await Promise.all([
        (
          await fetchFromApi<Item[]>(signal, API_ENDPOINTS.photos, {
            _limit: 10,
            albumId: item.albumId,
          })
        ).data || [],

        (
          await fetchFromApi<Item[]>(signal, API_ENDPOINTS.photos, {
            _limit: 10,
            title_like: item.title?.split(' ')[0],
          })
        ).data || [],
      ])

      setRelatedByAlbum(albumResult.filter((i: Item) => i.id !== item.id))
      setRelatedByName(nameResult.filter((i: Item) => i.id !== item.id))
    }

    fetchRelatedItems(item)
  }, [item, controller, navigate])

  if (loading) return <p className="text-gray-300">Loading...</p>

  return (
    <>
      <Header type="Details" />
      <Container>
        {item && (
          <>
            <ItemContainer>
              <ItemDetails>
                <Image
                  className="w-1/3 h-auto flex cursor-pointer"
                  src={item.url}
                  alt={item.title}
                  onClick={openPopup}
                />
                <div className="flex w-2/3 flex-col items-start pl-4">
                  <h1 className="text-xl md:text-4xl font-bold mb-4">{item.title}</h1>
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
                <Image
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
  z-index: 10;
`
