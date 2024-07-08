import { Link } from 'react-router-dom'
import styled from 'styled-components'

const BackLink: React.FC = () => {
  return <Back to="/">&larr; Back to Home</Back>
}

export default BackLink

const Back = styled(Link)`
  color: #4da6ff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
