import { ColorOptionsEnum, FabricOptionsEnum } from '@/Static/Enums'
import { useProductContext } from '@/context/ProductContext'
import { FilterProps } from '@/types/collection'
import { Slider } from '@mui/material'
import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import PrimaryButton from '../Buttons/PrimaryButton'
import { IoMdClose } from 'react-icons/io'

interface MobileFilterElementProps {
  filter: FilterProps
  setFilter: React.Dispatch<React.SetStateAction<FilterProps>>
  isFilterOpen: boolean
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MobileFilter: React.FC<MobileFilterElementProps> = ({
  filter,
  setFilter,
  isFilterOpen,
  setIsFilterOpen,
}) => {
  const [isAvailability, setIsAvailability] = useState<boolean>(false)
  const [isPrice, setIsPrice] = useState<boolean>(false)
  const [isDiscount, setIsDiscount] = useState<boolean>(false)
  const [isColors, setIsColors] = useState<boolean>(false)
  const [isFabrics, setIsFabrics] = useState<boolean>(false)
  const { colorOptions, fabricOptions } = useProductContext()
  return (
    <>
      <p
        className="fixed bottom-3 left-[50%] -translate-x-[50%] cursor-pointer rounded-full bg-primary px-8 py-2 text-xl text-white shadow-md min850:hidden"
        onClick={() => {
          setIsFilterOpen(true)
        }}
      >
        Product Filters
      </p>
      <div
        className={`fixed top-0 z-50 flex h-screen flex-col justify-between bg-white p-2 text-primary  min850:hidden ${isFilterOpen ? 'left-0 w-[90vw] min-w-[10rem]' : '-left-[90vw] w-0 min-w-0'} shadow-2xl`}
      >
        <IoMdClose
          size={'2rem'}
          className="absolute right-0 top-0 m-2 cursor-pointer"
          onClick={() => {
            setIsFilterOpen(false)
          }}
        />
        <div className="mt-8 flex flex-col gap-2 overflow-auto">
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
                    className={`border-primary ${filter.availability ? 'checked:bg-green-500' : 'unchecked:bg-red-500'}`}
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
                    className={`border-primary ${filter.availability ? 'checked:bg-green-500' : 'unchecked:bg-red-500'}`}
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
                                (selectedColor) =>
                                  selectedColor !== color.color,
                              )
                            : [...prev.colors, color.color],
                        }))
                      }}
                      className={`border-primary color-checkbox-${filter.colors.includes(color.color as never) ? 'checked' : 'unchecked'}`}
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
                      className={`border-primary fabric-checkbox-${filter.fabrics.includes(fabric.fabric as never) ? 'checked' : 'unchecked'}`}
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
        <PrimaryButton content="Close" func={() => setIsFilterOpen(false)} />
      </div>
    </>
  )
}

export default MobileFilter
