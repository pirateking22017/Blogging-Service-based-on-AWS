'use client'

import { useState } from "react"
import { signIn } from "aws-amplify/auth"
import { useRouter } from "next/navigation"
import { Amplify } from "aws-amplify"
import awsmobile from "../../../aws-exports"
import Image from "next/image"

Amplify.configure(awsmobile)

export default function Component() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { isSignedIn, nextStep } = await signIn({
        username,
        password,
      })

      console.log("Sign-in successful:", { isSignedIn, nextStep })

      if (isSignedIn) {
        router.push("/profile")
      }
    } catch (err) {
      setError("Error signing in: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: "url('/placeholder.svg')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-8 w-full max-w-md z-10 shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-white">nextBlog</h1>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-0 text-gray-800 transition duration-300 ease-in-out"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-0 text-gray-800 transition duration-300 ease-in-out"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white font-bold text-lg transition duration-300 ease-in-out ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Signing In..." : "Log in"}
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        <div className="mt-6 text-center">
          <a href="#" className="text-blue-300 hover:underline">Forgot password?</a>
        </div>
      </div>
    </div>
  )
}