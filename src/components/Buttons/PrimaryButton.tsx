import React from 'react'

interface PrimaryButtonProps {
  className?: string
  content: string
  func: ((e: any | null) => Promise<void>) | ((e: any | null) => void)
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  className,
  content,
  func,
}) => {
  return (
    <button
      onClick={func}
      className={`rounded-md bg-primary py-2 text-white ${className}`}
    >
      {content}
    </button>
  )
}

export default PrimaryButton
