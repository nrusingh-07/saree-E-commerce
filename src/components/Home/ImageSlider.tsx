'use client'
import React, { useState, useEffect } from 'react'

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const slides = [
    '/banner/banner1.webp',
    '/banner/banner1.webp',
    '/banner/banner1.webp',
    '/banner/banner1.webp',
    '/banner/banner1.webp',
    '/banner/banner1.webp',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 10000)

    return () => clearInterval(interval)
  }, [currentIndex])

  const showSlide = (index: number) => {
    if (index < 0) {
      setCurrentIndex(slides.length - 1)
    } else if (index >= slides.length) {
      setCurrentIndex(0)
    } else {
      setCurrentIndex(index)
    }
  }

  const nextSlide = () => {
    showSlide(currentIndex + 1)
  }

  return (
    <div className="ma relative w-[90vw] max-w-[70rem] overflow-hidden">
      <div
        className="flex transform transition-transform duration-500"
        style={{ transform: `translateX(${-currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt={`Slide ${index + 1}`}
            className="w-[70rem] "
          />
        ))}
      </div>
    </div>
  )
}

export default ImageSlider
