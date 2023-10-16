import getCurrentUser from '@/app/actions/getCurrentUser'
import React, { FC } from 'react'
import DesktopSidebar from './DesktopSidebar'
import MobileFooter from './MobileFooter'

interface SidebarProps {
  children: React.ReactNode
}

const Sidebar: FC<SidebarProps> = async ({ children }) => {
  const currentUser = await getCurrentUser()

  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  )
}

export default Sidebar
