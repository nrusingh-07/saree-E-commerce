'use client'
import { useUtilContext } from '@/context/UtilContext'

const Loader = () => {
  const { loader } = useUtilContext()

  if (loader)
    return <div className="loading absolute left-0 top-0">Loading&#8230;</div>
  else return <></>
}

export default Loader
