import React, { useCallback } from 'react'
import styled from 'styled-components'

interface ImagePopupProps {
  child: React.ReactNode
  onClose: () => void
}

const ImagePopup: React.FC<ImagePopupProps> = ({ child, onClose }) => {
  return <PopupContainer onClick={onClose}>{child}</PopupContainer>
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
  z-index: 10;
`
export default ImagePopup
