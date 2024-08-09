import { IoMdArrowDropdown } from 'react-icons/io'
import CollectionsHover from './Navbar/CollectionsHover'
import SaressHover from './Navbar/SareesHover'
import CategoriesHover from './Navbar/CategoriesHover'
import WeddingWivesHover from './Navbar/WeddingWivesHover'

const NavItems = () => {
  return (
    <ul className="flex flex-wrap items-start gap-2 font-light">
      <li className="px-4 py-3 hover:bg-gray-300">
        <p>NEW ARRIVALS</p>
      </li>
      <li className="group flex-col items-center  ">
        <span className="flex px-4 py-3 hover:bg-gray-300 ">
          <p>COLLECTIONS</p>
          <IoMdArrowDropdown size={'1.5rem'} />
        </span>
        <CollectionsHover />
      </li>
      <li className="group relative flex items-center">
        <span className="flex px-4 py-3 hover:bg-gray-300">
          <p>SAREES</p>
          <IoMdArrowDropdown size={'1.5rem'} />
        </span>
        <SaressHover />
      </li>
      <li className="px-4 py-3 hover:bg-gray-300">
        <p>LEHENGAS</p>
      </li>
      <li className="group relative flex items-center">
        <span className="flex px-4 py-3 hover:bg-gray-300">
          <p>CATEGORIES</p>
          <IoMdArrowDropdown size={'1.5rem'} />
        </span>
        <CategoriesHover />
      </li>
      <li className="px-4 py-3 hover:bg-gray-300">
        <p>READY TO SHIP</p>
      </li>
      <li className="group relative flex items-center">
        <span className="flex px-4 py-3 hover:bg-gray-300">
          <p>WEDDING VIBES</p>
          <IoMdArrowDropdown size={'1.5rem'} />
        </span>
        <WeddingWivesHover />
      </li>
    </ul>
  )
}

export default NavItems
