import { UserPlus, Home, Pen, Search, Settings, UserPen, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "../../components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Create",
    url: "/create-post",
    icon: Pen,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: UserPen,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Create Account",
    url: "/create-account",
    icon: UserPlus,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="bg-gray-900 text-black border-r border-gray-800">
      <SidebarHeader className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold text-black">Ayush Singh</h2>
            <p className="text-sm text-black">@ayushsingh</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs uppercase tracking-wider text-black">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full px-4 py-2 hover:bg-red-500 transition-colors">
                    <a href={item.url} className="flex items-center space-x-3 text-black hover:text-white">
                      <item.icon className="w-5 h-5 hover:text-red-500" />
                      <span className="hover:text-red-500">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-gray-800">
        <Button variant="outline" className="w-full flex items-center justify-center space-x-2 text-black hover:text-red-500 hover:bg-gray-800 border-gray-700">
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
