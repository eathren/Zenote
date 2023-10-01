import {
  AuthError,
  User,
  UserCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseSignUp,
} from "firebase/auth"
import { useEffect, useState, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "src/firebase"

// Added navigate as an argument
export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
    })

    // Clean up subscription
    return () => unsubscribe()
  }, [])

  // Function to handle login
  const onLogin = async (e: FormEvent, email: string, password: string) => {
    e.preventDefault()

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
      console.error("Error during sign-in:", authError.code)
    }
  }

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
      await firebaseSignIn(auth, email, password)
      navigate("/") // Navigate to home after sign in
    } catch (error) {
      console.error("Error signing in:", error)
    }
  }

  // Function to handle sign up
  const signUp = async (email: string, password: string) => {
    try {
      await firebaseSignUp(auth, email, password)
    } catch (error) {
      console.error("Error signing up:", error)
    }
  }

  return { user, onLogin, signOut, signIn, signUp }
}
