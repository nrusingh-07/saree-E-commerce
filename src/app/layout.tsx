import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserAuthContextProvider } from '@/context/AuthContext'
import { UtilContextProvider } from '@/context/UtilContext'
import Loader from '@/components/Loader'
import App from '@/components/App'
import { ProductContextProvider } from '@/context/ProductContext'
import { OrderContextProvider } from '@/context/OrderContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  // title: 'Pushkara Sathvaas',
  title: 'Saree',
  description: 'Saree Selling Website',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative`}>
        <UtilContextProvider>
          <UserAuthContextProvider>
            <ProductContextProvider>
              <OrderContextProvider>
                <App>{children}</App>
                <Loader />
              </OrderContextProvider>
            </ProductContextProvider>
          </UserAuthContextProvider>
        </UtilContextProvider>
      </body>
    </html>
  )
}
