import Link from 'next/link'
import {
  FaTwitter,
  FaFacebookF,
  FaPinterestP,
  FaInstagram,
  FaYoutube,
} from 'react-icons/fa'

const Footer = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="halfFooter flex h-40 w-screen items-center justify-center gap-16 max850:hidden">
        <div className="flex h-36 w-48 flex-col items-center rounded-lg border-[0.02rem] bg-white">
          <img src="/dummy.svg" className="w-28" />
          <p>Content 1</p>
        </div>
        <div className="flex h-36 w-48 flex-col items-center rounded-lg border-[0.02rem] bg-white">
          <img src="/dummy.svg" className="w-28" />
          <p>Content 2</p>
        </div>
        <div className="flex h-36 w-48 flex-col items-center rounded-lg border-[0.02rem] bg-white">
          <img src="/dummy.svg" className="w-28" />
          <p>Content 3</p>
        </div>
        <div className="flex h-36 w-48 flex-col items-center rounded-lg border-[0.02rem] bg-white">
          <img src="/dummy.svg" className="w-28" />
          <p>Content 4</p>
        </div>
      </div>
      <ul className="flex min-h-[30rem] w-screen flex-wrap justify-center gap-24 bg-primary pb-10 pt-12 font-light text-white max500:flex-col max500:gap-10 max500:px-5">
        <li className="flex flex-col gap-2">
          <h6 className="text-lg">POPULAR SEARCHES</h6>
          <ul className="flex flex-col gap-1 text-sm">
            <li>
              <Link href={'/collections/welding-collection'}>
                Welding Collection
              </Link>
            </li>
            <li>
              <Link href={'/collections/banarasi-saree'}>Banarasi Saree</Link>
            </li>
            <li>
              <Link href={'/collections/kanjivaram-saree'}>
                Kanjivaram Saree
              </Link>
            </li>
            <li>
              <Link href={'/collections/paithani-saree'}>Paithani Saree</Link>
            </li>
            <li>
              <Link href={'/collections/linen-saree'}>Linen Saree</Link>
            </li>
            <li>
              <Link href={'/collections/silk-saree'}>Silk Saree</Link>
            </li>
          </ul>
        </li>
        <li className="flex flex-col gap-2">
          <h6 className="text-lg">QUICKS LINKS</h6>
          <ul className="flex flex-col gap-1 text-sm">
            <li>
              <Link href={'/about-us'}>About Us</Link>
            </li>
            <li>
              <Link href={'/contact-us'}>Contact Us</Link>
            </li>
            <li>
              <Link href={'/media'}>Media</Link>
            </li>
            <li>
              <Link href={'/faq'}>FAQs / Help</Link>
            </li>
            <li>
              <Link href={'/blogs'}>Blogs</Link>
            </li>
            <li>
              <Link href={'/track-our-order'}>Track Your Order</Link>
            </li>
          </ul>
        </li>
        <li className="flex flex-col gap-2">
          <h6 className="text-lg">CUSTOMER SERVICE</h6>
          <ul className="flex flex-col gap-1 text-sm">
            <li>
              <Link href={'/shipping-policy'}>Shipping Policy</Link>
            </li>
            <li>
              <Link href={'/privacy-policy'}>Privacy Policy</Link>
            </li>
            <li>
              <Link href={'/return-policy'}>Returns & Exchange Policy</Link>
            </li>
            <li>
              <Link href={'/raise-a-return-product'}>
                Raise a Return Request
              </Link>
            </li>
            <li>
              <Link href={'/terms-condition'}>Terms & Conditions</Link>
            </li>
          </ul>
        </li>
        <li className="flex w-48 flex-col gap-2">
          <h6 className="text-lg">POPULAR SEARCHES</h6>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <b className="font-semibold">Pushkara Sathvaas technology,</b>
              <p>3390 Dylan Corners,</p>
              <p>Chasityview, NJ 84395</p>
            </li>
            <li>
              <p>For queries and feedback, write to us at:</p>
              <span className="flex gap-1">
                <p>Email:</p>
                <b className="font-semibold">sample@example.com</b>
              </span>
              <span className="flex gap-1">
                <p>Phone:</p>
                <b className="font-semibold">+91 99999 99999</b>
              </span>
            </li>
            <li>
              <b className="font-semibold">Opening Hours:</b>
              <p>Monday to Saturday: 10am - 7pm</p>
              <p>Sundays: Holiday</p>
            </li>
            <li className="flex items-center gap-3 pt-1">
              <Link href={'https://www.facebook.com/'}>
                <FaFacebookF className="mr-2 text-2xl" />
              </Link>
              <Link href={'https://www.instagram.com/'}>
                <FaInstagram className="mr-2 text-2xl" />
              </Link>
              <Link href={'https://www.pinterest.com/'}>
                <FaPinterestP className="mr-2 text-2xl" />
              </Link>
              <Link href={'https://www.twitter.com/'}>
                <FaTwitter className="mr-2 text-2xl" />
              </Link>
              <Link href={'https://www.youtube.com/'}>
                <FaYoutube className="mr-2 text-2xl" />
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default Footer
