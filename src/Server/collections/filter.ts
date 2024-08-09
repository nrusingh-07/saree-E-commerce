import { FilterProps } from '@/types/collection'
import { NextRequest } from 'next/server'

export const GetFilter = (req: NextRequest) => {
  const filter = JSON.parse(
    req.nextUrl.searchParams.get('filter')!,
  ) as FilterProps
  const page =
    req.nextUrl.searchParams.has('page') && req.nextUrl.searchParams.get('page')
      ? parseInt(req.nextUrl.searchParams.get('page')!) || 1
      : 1
  const filterObject: {
    [key: string]: object | boolean
  } = {}
  if (!filter) return {}
  filterObject['availability'] = filter.availability
  filterObject['discount'] = {
    $gt: filter.discount.min,
    $lt: filter.discount.max,
  }
  filterObject['price'] = { $gt: filter.price.min, $lt: filter.price.max }
  if (filter.colors.length > 0) {
    const regexString = filter.colors.join('|')
    const regexExpression = new RegExp(regexString, 'i')
    filterObject['color'] = { $regex: regexExpression }
  }

  if (filter.fabrics.length > 0) {
    const regexString = filter.fabrics.join('|')
    const regexExpression = new RegExp(regexString, 'i')
    filterObject['fabric'] = { $regex: regexExpression }
  }

  return { filterObject, page }
}
