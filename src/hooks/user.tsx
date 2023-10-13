import {
  AuthError,
  User,
  UserCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword as firebaseSignUp,
} from "firebase/auth"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "src/firebase"
import { openNotification } from "src/utils"

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)

  const navigate = useNavigate()

  const [loading, isLoading] = useState<boolean>(true)

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      isLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Function to handle sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      navigate("/") // Navigate to home after sign out
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Function to handle sign in
  const signIn = async (email: string, password: string) => {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user

      // Navigate to the home page if signed in
      if (user) {
        navigate("/")
      }
      return user
    } catch (error) {
      const authError: AuthError = error as AuthError
      openNotification("error", "Error during sign-in", authError.message)
      console.error("Error during sign-in:", authError.code)
    }
  }

  // Function to handle sign up
  const signUp = async (email: string, password: string) => {
    try {
      const userCredential: UserCredential = await firebaseSignUp(
        auth,
        email,
        password
      )
      const user = userCredential.user

      // Navigate to the home page only if sign-up is successful
      if (user) {
        navigate("/")
      }

      return user
    } catch (error) {
      const authError: AuthError = error as AuthError
      // Show an error notification
      openNotification("error", "Error during sign-up", authError.message)
      console.error("Error during sign-up:", authError.code)
    }
  }

  return { user, signOut, signIn, signUp, loading }
}
