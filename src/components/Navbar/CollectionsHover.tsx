import Link from 'next/link'

const data = [
  { id: 'favourite-picks', name: 'Favourite Picks' },
  { id: 'summer-sarees', name: 'Summer Sarees' },
  { id: 'casual-style', name: 'Casual Style' },
  { id: 'grand-heritage-sale', name: 'Grand Heritage Sale' },
]

const CollectionsHover = () => {
  return (
    <ul className="absolute hidden w-48 flex-col gap-2 rounded-md bg-white p-7 text-sm shadow-lg group-hover:flex">
      {data.map((item) => {
        return (
          <li key={item.id} className="hover:underline">
            <Link href={`/collections/${item.id}`}>{item.name}</Link>
          </li>
        )
      })}
    </ul>
  )
}

export default CollectionsHover
