import React, { useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Item } from '../../types/item-type'
import Image from '../common/Image'
import { UI_URL } from '../../constants'
import { DataContext } from '../../services/DataContext'

const RelatedItem: React.FC<{ item: Item }> = ({ item }) => {
  const { setSelectedItem } = useContext(DataContext)
  const navigate = useNavigate()

  const handleItemClick = useCallback(() => {
    setSelectedItem(item)
    navigate(UI_URL.item.replace(':id', item.id))
  }, [item, navigate, setSelectedItem])

  return (
    <div className="flex items-center mb-4 cursor-pointer" onClick={handleItemClick}>
      <Image src={item.thumbnailUrl} alt={item.title} className="w-16 h-16 rounded-md" />
      <p className="pl-4 text-lg text-gray-300 w-full overflow-hidden text-ellipsis whitespace-nowrap">
        {item.title}
      </p>
    </div>
  )
}

export default RelatedItem
