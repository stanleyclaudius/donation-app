import { Link, useLocation } from 'react-router-dom'

interface IProps {
  path: string
  text: string
}

const NavbarLink = ({ path, text }: IProps) => {
  const { pathname } = useLocation()

  return (
    <Link
      to={path}
      className={`w-fit relative ${pathname === path && 'after:content-* after:w-2/3 after:h-[3px] after:bg-orange-300 after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2'} hover:after:content-* hover:after:w-2/3 hover:after:h-[3px] hover:after:bg-orange-300 hover:after:absolute hover:after:-bottom-2 hover:after:left-1/2 hover:after:-translate-x-1/2`}
    >
      {text}
    </Link>
  )
}

export default NavbarLink