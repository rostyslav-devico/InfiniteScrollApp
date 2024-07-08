import React, { useCallback } from 'react'
import styled from 'styled-components'

interface ImagePopupProps {
  imageUrl: string
  onClose: () => void
}

const ImagePopup: React.FC<ImagePopupProps> = ({ imageUrl, onClose }) => {
  const stopPropagation = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation()
  }, [])

  return (
    <PopupContainer onClick={onClose}>
      <PopupImage src={imageUrl} alt="Full Size" onClick={stopPropagation} />
    </PopupContainer>
  )
}

const PopupContainer = styled.div`
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

const PopupImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

export default ImagePopup
