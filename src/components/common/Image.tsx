import { useCallback, useState } from 'react'
import Logo from '../../assets/logo'

const Image: React.FC<{ src: string; alt: string; className?: string; onClick?: () => void }> = ({
  src,
  alt,
  className,
  onClick,
}) => {
  const [loading, setLoading] = useState(true)

  const handleImageLoad = useCallback(() => {
    setLoading(false)
  }, [setLoading, src])

  return (
    <div className={className} onClick={onClick}>
      {loading && (
        <div className="flex items-center justify-center h-full w-full">
          <Logo className="class-name" />
        </div>
      )}
      <img
        className={loading ? 'hidden' : 'rounded-[4px]'}
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
      />
    </div>
  )
}

export default Image
