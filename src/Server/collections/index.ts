import { NextRequest } from 'next/server'
import collectionData from './collectionData'

const getCollectionData = async (collectionName: string, req: NextRequest) => {
  try {
    if (!collectionData[collectionName]) {
      return {
        products: [],
        totalProducts: 0,
      }
    }
    const data = await collectionData[collectionName](req)
    return data
  } catch (e) {
    console.log(e)
    return {
      products: [],
      totalProducts: 0,
    }
  }
}

export default getCollectionData
