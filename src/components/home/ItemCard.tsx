import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Item } from '../../types/item-type'
import Logo from '../../assets/logo'

interface StyledItemCardProps {
  item: Item
}

const ItemCard: React.FC<StyledItemCardProps> = ({ item }) => {
  const [loading, setLoaded] = useState(true)
  const handleImageLoad = useCallback(() => {
    setLoaded(false)
  }, [setLoaded])

  return (
    <CardContainer href={`/item/${item.id}`} key={item.id}>
      <Card>
        {loading && (
          <div className="ml-[16px] flex items-center justify-center h-[150px]">
            <Logo />
          </div>
        )}
        <Thumbnail
          className={loading ? 'hidden' : ''}
          src={item.thumbnailUrl}
          onLoad={handleImageLoad}
        />
        <Title className="line-clamp-4">{item.title}</Title>
      </Card>
    </CardContainer>
  )
}

const CardContainer = styled.a`
  width: 100%;
  padding: 16px;

  @media (min-width: 768px) {
    width: 50%;
  }

  @media (min-width: 1280px) {
    width: 33.33%;
  }
`

const Card = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  background-color: #282c34;
  border: 2px solid #636363;
  border-radius: 8px;
  padding: 16px;
`

const Thumbnail = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 4px;
`

const Title = styled.p`
  text-align: left;
  font-size: 24px;
  color: #e6e6e6;
  font-weight: 500;
  margin-top: 8px;
  text-transform: capitalize;
`

export default ItemCard
