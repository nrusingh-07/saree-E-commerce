'use client'
import PrimaryButton from '@/components/Buttons/PrimaryButton'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { auth } from '@/config/Firebase'
import { useUtilContext } from '@/context/UtilContext'
import { TextField } from '@mui/material'
import { sendPasswordResetEmail } from 'firebase/auth'
import Link from 'next/link'
import { useState } from 'react'

const Page = () => {
  const [email, setEmail] = useState<string>('')
  const { setLoader } = useUtilContext()

  const isEmail = () => {
    const Regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return Regex.test(email)
  }

  const sendChangeLink = async (e: any | null) => {
    e?.preventDefault()
    setLoader(true)
    try {
      if (!isEmail()) return
      await sendPasswordResetEmail(auth, email, {
        url: '/login',
      })
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="mt-5 flex flex-col items-center gap-3">
        <div id="recaptcha-container"></div>
        <h3 className="text-4xl">Forgot Password</h3>
        <form className="flex w-[90vw] max-w-[22rem] flex-col gap-3">
          <TextField
            name="email"
            type="email"
            label="Email"
            error={!isEmail()}
            className="rounded-md border-[0.02rem] border-gray-400 p-1 py-2 focus:border-primary focus:text-primary focus:outline-none active:border-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex justify-center gap-3">
            <button
              className="w-28 rounded-md border-[0.02rem] border-primary text-primary"
              type="button"
            >
              Cancel
            </button>
            <PrimaryButton
              content={'Submit'}
              func={sendChangeLink}
              className={'w-28'}
            />
          </div>
        </form>
        <Link href={'/login'}>
          <p className="text-sm text-primary">Sign in Instead</p>
        </Link>
      </div>
      <Footer />
    </div>
  )
}

export default Page
