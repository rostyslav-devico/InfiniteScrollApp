import styled from 'styled-components'
import { Item } from '../../types/item-type'
import RelatedItem from './RelatedItem'

interface RelatedProps {
  items: Item[]
  title: string
}

const RelatedList: React.FC<RelatedProps> = ({ items, title }) => {
  return (
    <RelatedItemsSection>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="h-full md:max-h-[400px] overflow-y-auto">
        {items.length > 0 ? (
          items.map(relatedItem => <RelatedItem item={relatedItem} key={relatedItem.id} />)
        ) : (
          <p className="text-gray-300">No related items found.</p>
        )}
      </div>
    </RelatedItemsSection>
  )
}

export default RelatedList

const RelatedItemsSection = styled.div`
  width: 100%;
  background-color: #282c34;
  border: 2px solid #636363;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;

  @media (min-width: 768px) {
    width: 50%;
  }
`
