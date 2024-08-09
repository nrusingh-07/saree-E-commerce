import Link from 'next/link'
import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const data = [
  {
    heading: 'Weaves',
    val: [
      { id: 'banarasi-saree', name: 'Banarasi Saree' },
      { id: 'paithani-saree', name: 'Paithani Saree' },
      { id: 'kanjivaram-saree', name: 'Kanjivaram Saree' },
      { id: 'patola-sarees', name: 'Patola Sarees' },
      { id: 'organza-saree', name: 'Organza Saree' },
      { id: 'south-silk-saree', name: 'South Silk Saree' },
      { id: 'maheshwari-saree', name: 'Maheshwari Saree' },
      { id: 'luxe-saree', name: 'Luxe Saree' },
    ],
  },
  {
    heading: 'Fabric',
    val: [
      { id: 'silk-sarees', name: 'Silk Sarees' },
      { id: 'cotton-sarees', name: 'Cotton Sarees' },
      { id: 'liten-style', name: 'Linen Style' },
      { id: 'chiffon-saree', name: 'Chiffon Saree' },
      { id: 'satin-silk-saree', name: 'Satin Silk Saree' },
      { id: 'georgette-saree', name: 'Georgette Saree' },
      { id: 'dola-silk-saree', name: 'Dola Silk Saree' },
      { id: 'brasso-saree', name: 'Brasso Saree' },
    ],
  },
  {
    heading: 'Prints',
    val: [
      { id: 'printed-sarees', name: 'Printed Sarees' },
      { id: 'kalamkari-sarees', name: 'Kalamkari Sarees' },
      { id: 'ajrakh-sarees', name: 'Ajrakh Sarees' },
    ],
  },
  {
    heading: 'Colour',
    val: [
      { id: 'black-sarees', name: 'Black Sarees' },
      { id: 'red-sarees', name: 'Red Sarees' },
      { id: 'pink-sarees', name: 'Pink Sarees' },
      { id: 'blue-sarees', name: 'Blue Sarees' },
      { id: 'godlen-sarees', name: 'Golden Sarees' },
      { id: 'purple-sarees', name: 'Purple Sarees' },
      { id: 'green-sarees', name: 'Green Sarees' },
      { id: 'grey-sarees', name: 'Grey Sarees' },
      { id: 'magenta-sarees', name: 'Magenta Sarees' },
      { id: 'maroon-sarees', name: 'Maroon Sarees' },
      { id: 'orange-sarees', name: 'Orange Sarees' },
      { id: 'yellow-sarees', name: 'Yellow Sarees' },
      { id: 'multicolor-sarees', name: 'Multicolor Sarees' },
      { id: 'brown-sarees', name: 'Brown Sarees' },
      { id: 'turquoise-sarees', name: 'Turquoise Sarees' },
    ],
  },
]

const SmallSaressHover = () => {
  const [show, setShow] = useState<boolean>(false)
  const [subShow, setSubShow] = useState<string>('')

  const toggleSubmenu = (heading: string) => {
    setSubShow((prev) => (prev === heading ? '' : heading))
  }

  return (
    <li className="flex w-[96%] cursor-pointer flex-col gap-2 border-b-[0.02rem] py-2 text-lg">
      <h1
        className="flex cursor-pointer items-center justify-between text-xl"
        onClick={() => {
          setShow((prev) => !prev)
          toggleSubmenu('')
        }}
      >
        <p>SAREES</p>
        <span className="ml-2 text-base">
          {show ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </h1>
      {show && (
        <ul className={`flex flex-col gap-2 pl-2 text-lg`}>
          {data.map((item) => (
            <li key={item.heading}>
              <h1
                className="flex cursor-pointer items-center justify-between text-base"
                onClick={() => toggleSubmenu(item.heading)}
              >
                <p>{item.heading.toUpperCase()}</p>
                <span className="ml-2 text-sm">
                  {subShow === item.heading ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </span>
              </h1>
              {subShow === item.heading && (
                <ul className={`flex w-[96%] flex-col gap-2 pl-2 pt-1`}>
                  {item.val.map((i) => (
                    <li
                      key={i.id}
                      className="cursor-pointer text-sm hover:underline"
                    >
                      <Link href={`/collections/${i.id}`}>{i.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default SmallSaressHover
