import { ColorOptionsEnum, FabricOptionsEnum } from '@/Static/Enums'
import { useProductContext } from '@/context/ProductContext'
import { FilterProps } from '@/types/collection'
import { Slider } from '@mui/material'
import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

interface FilterElementProps {
  filter: FilterProps
  setFilter: React.Dispatch<React.SetStateAction<FilterProps>>
}

const Filter: React.FC<FilterElementProps> = ({ filter, setFilter }) => {
  const [isAvailability, setIsAvailability] = useState<boolean>(false)
  const [isPrice, setIsPrice] = useState<boolean>(false)
  const [isDiscount, setIsDiscount] = useState<boolean>(false)
  const [isColors, setIsColors] = useState<boolean>(false)
  const [isFabrics, setIsFabrics] = useState<boolean>(false)
  const { colorOptions, fabricOptions } = useProductContext()
  return (
    <div className="sticky left-0 top-[10rem] mt-10 flex h-[100rem] w-[18rem] flex-col gap-2 px-3 py-1 max850:hidden">
      <p className="text-xl">Filters</p>
      <div>
        <ul className="flex flex-col gap-1 border-b-[0.04rem] p-1">
          <li
            className="flex cursor-pointer items-center justify-between"
            onClick={() => setIsAvailability((prev) => !prev)}
          >
            <p>Availability</p>
            <div
              className={`transform transition-transform duration-300 ${
                isAvailability ? 'rotate-180' : ''
              }`}
            >
              {isAvailability ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </li>
          {isAvailability && (
            <>
              <li
                className="flex cursor-pointer items-center gap-1 px-1"
                onClick={() => {
                  setFilter((prev) => ({ ...prev, availability: true }))
                }}
              >
                <input
                  type="checkbox"
                  name={'in-stock'}
                  value={'in-stock'}
                  checked={filter.availability}
                  onChange={() => {}}
                  className={`${filter.availability ? 'checked:bg-green-500' : 'unchecked:bg-red-500'}`}
                />
                <label>In Stock</label>
              </li>
              <li
                className="flex cursor-pointer items-center gap-1 px-1"
                onClick={() => {
                  setFilter((prev) => ({ ...prev, availability: false }))
                }}
              >
                <input
                  type="checkbox"
                  name={'out-of-stock'}
                  value={'out-of-stock'}
                  checked={!filter.availability}
                  onChange={() => {}}
                  className={`${filter.availability ? 'checked:bg-green-500' : 'unchecked:bg-red-500'}`}
                />
                <label>Out Of Stock</label>
              </li>
            </>
          )}
        </ul>
        <ul className="flex flex-col gap-1 border-b-[0.04rem] p-1">
          <li
            className="flex cursor-pointer items-center justify-between"
            onClick={() => setIsDiscount((prev) => !prev)}
          >
            <p>Discount</p>
            <div
              className={`transform transition-transform duration-300 ${
                isDiscount ? 'rotate-180' : ''
              }`}
            >
              {isDiscount ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </li>
          {isDiscount && (
            <>
              <li className="px-4">
                <Slider
                  getAriaLabel={() => 'Discount range'}
                  value={[filter.discount.min, filter.discount.max]}
                  onChange={(e, value: number | number[]) => {
                    setFilter((prev) => ({
                      ...prev,
                      discount: {
                        min: (value as number[])[0],
                        max: (value as number[])[1],
                      },
                    }))
                  }}
                  min={0}
                  max={90}
                  valueLabelDisplay="auto"
                />
              </li>
              <li className="flex items-center justify-between px-1">
                <span>{filter.discount.min}%</span>
                <span>{filter.discount.max}%</span>
              </li>
            </>
          )}
        </ul>
        <ul className="flex flex-col gap-1 border-b-[0.04rem] p-1">
          <li
            className="flex cursor-pointer items-center justify-between"
            onClick={() => setIsPrice((prev) => !prev)}
          >
            <p>Price</p>
            <div
              className={`transform transition-transform duration-300 ${
                isPrice ? 'rotate-180' : ''
              }`}
            >
              {isPrice ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </li>
          {isPrice && (
            <>
              <li className="px-4">
                <Slider
                  getAriaLabel={() => 'Temperature range'}
                  value={[filter.price.min, filter.price.max]}
                  onChange={(e, value: number | number[]) => {
                    setFilter((prev) => ({
                      ...prev,
                      price: {
                        min: (value as number[])[0],
                        max: (value as number[])[1],
                      },
                    }))
                  }}
                  min={0}
                  max={100000}
                  valueLabelDisplay="auto"
                />
              </li>
              <li className="flex items-center justify-between px-1">
                <span>₹{filter.price.min}</span>
                <span>₹{filter.price.max}</span>
              </li>
            </>
          )}
        </ul>
        <ul className="flex flex-col gap-1 border-b-[0.04rem] p-1">
          <li
            className="flex cursor-pointer items-center justify-between"
            onClick={() => setIsColors((prev) => !prev)}
          >
            <p>Colors</p>
            <div
              className={`transform transition-transform duration-300 ${
                isColors ? 'rotate-180' : ''
              }`}
            >
              {isColors ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </li>
          {isColors && (
            <>
              {colorOptions.map((color) => (
                <li
                  className="flex cursor-pointer items-center gap-1 px-1"
                  key={color.color}
                >
                  <input
                    type="checkbox"
                    name={`color-${color.color}`}
                    checked={filter.colors.includes(color.color as never)}
                    onChange={() => {
                      setFilter((prev) => ({
                        ...prev,
                        colors: prev.colors.includes(color.color as never)
                          ? prev.colors.filter(
                              (selectedColor) => selectedColor !== color.color,
                            )
                          : [...prev.colors, color.color],
                      }))
                    }}
                    className={`color-checkbox-${filter.colors.includes(color.color as never) ? 'checked' : 'unchecked'}`}
                  />
                  <label className="font-light">
                    {color.color} ({color.noOfProducts})
                  </label>
                </li>
              ))}
            </>
          )}
        </ul>
        <ul className="flex flex-col gap-1 border-b-[0.04rem] p-1">
          <li
            className="flex cursor-pointer items-center justify-between"
            onClick={() => setIsFabrics((prev) => !prev)}
          >
            <p>Fabric</p>
            <div
              className={`transform transition-transform duration-300 ${
                isFabrics ? 'rotate-180' : ''
              }`}
            >
              {isFabrics ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </li>
          {isFabrics && (
            <>
              {fabricOptions.map((fabric) => (
                <li
                  className="flex cursor-pointer items-center gap-1 px-1"
                  key={fabric.fabric}
                >
                  <input
                    type="checkbox"
                    name={`fabric-${fabric.fabric}`}
                    checked={filter.fabrics.includes(fabric.fabric as never)}
                    onChange={() => {
                      setFilter((prev) => ({
                        ...prev,
                        fabrics: prev.fabrics.includes(fabric.fabric as never)
                          ? prev.fabrics.filter(
                              (selectedFabric) =>
                                selectedFabric !== fabric.fabric,
                            )
                          : [...prev.fabrics, fabric.fabric],
                      }))
                    }}
                    className={`fabric-checkbox-${filter.fabrics.includes(fabric.fabric as never) ? 'checked' : 'unchecked'}`}
                  />
                  <label className="font-light">
                    {fabric.fabric} ({fabric.noOfProducts})
                  </label>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Filter
