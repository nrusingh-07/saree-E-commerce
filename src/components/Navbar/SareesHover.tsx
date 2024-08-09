import Link from 'next/link'

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

const SaressHover = () => {
  return (
    <div className="absolute -left-36 top-10 hidden gap-32 rounded-md bg-white p-7 text-sm shadow-lg group-hover:flex">
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

export default SaressHover
