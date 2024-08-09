import Link from 'next/link'
import { useState } from 'react'

const data = [
  { id: 'favourite-picks', name: 'Favourite Picks' },
  { id: 'summer-sarees', name: 'Summer Sarees' },
  { id: 'casual-style', name: 'Casual Style' },
  { id: 'grand-heritage-sale', name: 'Grand Heritage Sale' },
]

const SmallCollectionsHover = () => {
  const [show, setShow] = useState<boolean>(false)
  return (
    <li className="flex w-[96%] cursor-pointer flex-col gap-2 border-b-[0.02rem] py-2 text-lg">
      <h1 className="text-xl" onClick={() => setShow((prev) => !prev)}>
        COLLECTIONS
      </h1>
      {show && (
        <ul
          className={`flex w-[96%] cursor-pointer flex-col gap-2 pl-2 text-lg `}
        >
          {data.map((item) => {
            return (
              <li key={item.id} className="hover:underline">
                <Link href={`/collections/${item.id}`}>{item.name}</Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

export default SmallCollectionsHover
