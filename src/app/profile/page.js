'use client'

import { useState, useEffect } from "react"
import { getCurrentUser, signOut } from "aws-amplify/auth"
import { Amplify } from "aws-amplify"
import awsmobile from "../../../aws-exports"
import { User, Mail, Key, Calendar, LogOut, Shield, Activity, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

Amplify.configure(awsmobile)

export default function Profile() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (err) {
        setError("Error fetching user: " + err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = "/"
    } catch (error) {
      console.log("Error signing out: ", error)
      setError("Error signing out: " + error.message)
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorCard error={error} />
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="flex flex-col items-center space-y-4 pb-8 pt-6 px-6 border-b">
          <Avatar className="w-32 h-32 border-4 border-primary shadow-lg">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.username}`} alt={user?.username} />
            <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold">{user?.username}</CardTitle>
          <div className="text-sm text-muted-foreground">Member since 11 November</div>
        </CardHeader>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="p-6">
            <div className="space-y-4">
              <InfoItem icon={User} label="User ID" value={user?.userId} />
              <InfoItem icon={Mail} label="Email" value={user?.signInDetails?.loginId} />
              <InfoItem icon={Key} label="Sign-in Method" value={user?.signInDetails?.authFlowType} />
              <InfoItem
                icon={Calendar}
                label="Last Sign-in"
                value="Today"
              />
            </div>
          </TabsContent>
          <TabsContent value="security" className="p-6">
            <div className="space-y-4">
              <InfoItem icon={Shield} label="Two-Factor Authentication" value="Enabled" />
              <InfoItem icon={Key} label="Password Last Changed" value="2 months ago" />
              <Button className="mt-4">Change Password</Button>
            </div>
          </TabsContent>
          <TabsContent value="activity" className="p-6">
            <div className="space-y-4">
              <InfoItem icon={Activity} label="Last Activity" value="Logged in from Pune" />
              <InfoItem icon={Settings} label="Device" value="LinuxPC" />
              <Button variant="outline" className="mt-4">View Full Activity Log</Button>
            </div>
          </TabsContent>
        </Tabs>
        <CardFooter className="flex justify-between items-center p-6 bg-gray-50">
          <Button variant="outline">Edit Profile</Button>
          <Button variant="destructive" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center space-x-3 text-sm">
      <Icon className="w-5 h-5 text-primary" />
      <span className="font-medium text-gray-600">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-col items-center space-y-4 pb-8 pt-6 px-6 border-b">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ErrorCard({ error }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    </div>
  )
}