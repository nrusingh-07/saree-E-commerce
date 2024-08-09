export interface FilterProps {
  availability: boolean
  price: {
    min: number
    max: number
  }
  discount: {
    min: number
    max: number
  }
  rating: {
    min: number
    max: number
  }
  colors: string[] | never[]
  fabrics: string[] | never[]
}
