import Link from 'next/link'

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

const CategoriesHover = () => {
  return (
    <div className="absolute top-10 hidden gap-32 rounded-md bg-white p-7 text-sm shadow-lg group-hover:flex">
      {data.map((item) => {
        return (
          <div key={item.heading} className="flex flex-col gap-4">
            <h1 className="text-xl">{item.heading.toUpperCase()}</h1>
            <ul className="flex flex-col gap-2">
              {item.val.map((item) => {
                return (
                  <li key={item.id} className="min-w-32 hover:underline">
                    <Link
                      href={`/collections/${item.id}`}
                      className="text-nowrap"
                    >
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default CategoriesHover
