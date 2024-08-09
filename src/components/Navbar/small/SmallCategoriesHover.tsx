import Link from 'next/link'
import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const data = [
  {
    heading: 'ACCESSORIES',
    val: [
      { id: 'jewellery', name: 'Jewellery' },
      { id: 'earrings', name: 'Earrings' },
      { id: 'necklaces', name: 'Necklaces' },
    ],
  },
]

const SmallCategoriesHover = () => {
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
        <p>COLLECTIONS</p>
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

export default SmallCategoriesHover
