import { NextResponse } from 'next/server'

const GET = async (req: Request, res: Response) => {
  return new NextResponse('Hello, world!', {
    status: 200,
  })
}

export { GET }
