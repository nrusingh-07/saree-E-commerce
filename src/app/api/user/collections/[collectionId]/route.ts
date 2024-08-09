import getCollectionData from '@/Server/collections'
import DbConnect from '@/config/DbConfig'
import { NextRequest, NextResponse } from 'next/server'

const GET = async (req: NextRequest, res: Response) => {
  try {
    await DbConnect()

    const collectionId = req.nextUrl.pathname.split('/user/collections/')[1]

    const { products, totalProducts } = await getCollectionData(
      collectionId,
      req,
    )

    return new NextResponse(
      JSON.stringify({
        products,
        totalProducts,
      }),
      {
        status: 200,
      },
    )
  } catch (e: any) {
    console.log(e)
    return new NextResponse(e.message, {
      status: 500,
    })
  }
}

export { GET }
