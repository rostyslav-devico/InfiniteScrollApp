import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Logo from '../../assets/logo'
import { Link } from 'react-router-dom'
import { UI_URL } from '../../constants'

interface HeaderProps {
  onSearch?: (query: string) => void
  Query?: string
  type: 'Home' | 'Details'
}

const Header: React.FC<HeaderProps> = ({ onSearch, Query, type }) => {
  const [searchQuery, setSearchQuery] = useState(Query || '')
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onSearch && e.target.value.trim() !== Query) {
        onSearch(e.target.value.trim())
      }
      setSearchQuery(e.target.value)
    },
    [onSearch, Query],
  )

  return (
    <HeaderContainer>
      <Logo className="h-14 w-14 ml-4" />
      {type === 'Details' && <BackLink to={UI_URL.root}>&larr; Back to Home</BackLink>}
      {type === 'Home' && (
        <SearchInput
          type="text"
          name="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
        />
      )}
    </HeaderContainer>
  )
}

const HeaderContainer = styled.div`
  width: 100%;
  height: 64px;
  position: fixed;
  background-color: #282c34;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 5;
`

const SearchInput = styled.input`
  margin-left: 16px;
  padding: 8px;
  border-radius: 4px;
  background-color: #3c4147;
  color: #e6e6e6;
  font-size: 16px;
  border: none;
  outline: none;
`

const BackLink = styled(Link)`
  color: #4da6ff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export default Header
