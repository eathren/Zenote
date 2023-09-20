import { useState, ChangeEvent, FormEvent } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth"
import { AuthError } from "firebase/auth"
import { auth } from "../firebase"

export const SignUpPage = () => {
  const navigate = useNavigate()

  // State with explicit types
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  // Explicitly type the event parameter
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      // Type for userCredential is UserCredential
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password)

      // Signed in
      const user = userCredential.user

      // Redirect to login page
      if (user) {
        navigate("/login")
      }
    } catch (error) {
      // Type for error is AuthError
      const authError: AuthError | any = error
      const errorCode = authError.code
      // const errorMessage = authError.message;

      // Handle error (e.g., show error message)
      console.error("Error during sign-up:", errorCode)
    }
  }

  return (
    <main>
      <section>
        <div>
          <div>
            <h1>FocusApp</h1>
            <form onSubmit={onSubmit}>
              <div>
                <label htmlFor="email-address">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                  placeholder="Email address"
                />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                  placeholder="Password"
                />
              </div>

              <button type="submit">Sign up</button>
            </form>

            <p>
              Already have an account? <NavLink to="/login">Sign in</NavLink>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
