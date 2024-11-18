"use client"

import { Amplify } from "aws-amplify"
import { useState, useEffect } from "react"
import Link from "next/link"
import { getUrl } from "aws-amplify/storage"
import { generateClient } from "aws-amplify/api"
import { listPosts } from "../../graphql/queries"
import awsmobile from "../../aws-exports"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { Badge } from "../components/ui/badge"
import { BookOpen, Calendar, User, AlertTriangle } from "lucide-react"

Amplify.configure(awsmobile)

const client = generateClient()

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const variables = {
        limit: 100,
        nextToken: null,
      }

      const postData = await client.graphql({
        query: listPosts,
        variables,
      })

      const { items } = postData.data.listPosts
      console.log("Fetched Posts:", items)

      const postsWithImages = await Promise.all(
        items.map(async (post) => {
          if (post.coverImage) {
            post.coverImage = await getUrl({ key: post.coverImage })
          }
          return post
        })
      )

      setPosts(postsWithImages)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching posts or images:", error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-grey-900 to-violet-800 pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight mb-12 text-white text-center">
          Explore Our Latest Posts
        </h1>
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-[400px] w-full bg-gray-800/50" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Alert variant="destructive" className="my-8 bg-red-900/50 border-red-500 text-red-100">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">No posts available</AlertTitle>
            <AlertDescription className="text-red-200">
              Check back later for exciting new content!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts?pageId=${post.id}`} passHref>
                <Card className="h-full hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 bg-white/10 backdrop-blur-sm border-purple-500/20">
                  {/*post.coverImage && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  )*/}
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white">
                      <span dangerouslySetInnerHTML={{ __html: post.title }} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 line-clamp-3">
                      <span dangerouslySetInnerHTML={{ __html: post.content }} />
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <User className="h-4 w-4" />
                      <span>{post.username}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardFooter>
                  <div className="px-6 pb-4">
                    <Badge variant="secondary" className="bg-purple-700 text-purple-100">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {post.category || "Blog"}
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}