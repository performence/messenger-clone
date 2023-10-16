import clsx from 'clsx'
import Link from 'next/link'
import { FC } from 'react'

interface MobileItemProps {
  label: string
  icon: any
  href: string
  onClick?: () => void
  active?: boolean
}

const MobileItem: FC<MobileItemProps> = ({ href, icon: Icon, active, onClick }) => {
  const handleClick = () => (onClick ? onClick() : null)

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={clsx(
        `
    group
    flex
    gap-x-3
    text-sm
    leading-6
    font-semibold
    w-full
    justify-center
    p-4
    text-gray-500
    hover:text-black
    hover:bg-gray-100
    `,
        active && 'bg-gray-100 text-black'
      )}
    >
      <Icon />
    </Link>
  )
}

export default MobileItem
