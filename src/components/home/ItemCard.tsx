import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import { Item } from '../../types/item-type'
import Image from '../common/Image'
import { DataContext } from '../../services/DataContext'
import { useNavigate } from 'react-router-dom'
import { UI_URL } from '../../constants'

interface StyledItemCardProps {
  item: Item
}

const ItemCard: React.FC<StyledItemCardProps> = ({ item }) => {
  const { setSelectedItem } = useContext(DataContext)
  const navigate = useNavigate()

  const handleItemClick = useCallback(() => {
    setSelectedItem(item)
    navigate(UI_URL.item.replace(':id', item.id))
  }, [item, navigate, setSelectedItem])

  return (
    <CardContainer key={item.id}>
      <Card onClick={handleItemClick}>
        <Image src={item.thumbnailUrl} alt={item.title} className="flex-none w-[150px] h-[150px]" />
        <p className="w-full text-left text-xl lg:text-2xl text-gray-200 font-medium my-[16px] lg:my-[8px] mr-[16px] capitalize line-clamp-4 overflow-hidden">
          {item.title}
        </p>
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
  cursor: pointer;
  flex-direction: row;
  gap: 16px;
  background-color: #282c34;
  border: 2px solid #636363;
  border-radius: 8px;
`

export default ItemCard
