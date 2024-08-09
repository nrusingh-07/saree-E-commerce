import React from 'react'

interface PrimaryButtonProps {
  className?: string
  content: string
  func: ((e: any | null) => Promise<void>) | ((e: any | null) => void)
}

const LightPrimaryButton: React.FC<PrimaryButtonProps> = ({
  className,
  content,
  func,
}) => {
  return (
    <button
      onClick={func}
      className={`rounded-md border-[0.02rem] border-primary bg-white py-2 text-primary hover:bg-primary hover:text-white ${className}`}
      style={{
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {content}
    </button>
  )
}

export default LightPrimaryButton
