import React, { createContext, useState } from 'react'
import { Item } from '../types/item-type'

interface DataContextProps {
  selectedItem: Item | null
  setSelectedItem: React.Dispatch<React.SetStateAction<Item | null>>
}

export const DataContext = createContext<DataContextProps>({
  selectedItem: null,
  setSelectedItem: () => {},
})

export const DataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  return (
    <DataContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </DataContext.Provider>
  )
}
