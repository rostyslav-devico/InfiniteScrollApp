import React, { useCallback } from 'react'
import styled from 'styled-components'
import Logo from '../assets/logo'
import BackLink from './detailsPage/BackLink'

interface HeaderProps {
  onSearch?: (query: string) => void
  searchQuery?: string
  type: string
}

const Header: React.FC<HeaderProps> = ({ onSearch, searchQuery, type }) => {
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onSearch) onSearch(e.target.value)
    },
    [onSearch],
  )

  return (
    <HeaderContainer>
      <Logo />
      {type === 'Details' && <BackLink />}
      {type === 'Home' && (
        <SearchInput
          type="text"
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
  z-index: 999;
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

export default Header
