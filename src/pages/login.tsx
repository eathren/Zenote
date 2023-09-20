import { useState, FormEvent, ChangeEvent } from "react"
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth"
import { AuthError } from "firebase/auth"
import { auth } from "../firebase"
import { NavLink, useNavigate } from "react-router-dom"

export const LoginPage = () => {
  const navigate = useNavigate()

  // State variables with explicit types
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  // Explicitly type the event parameter for the onLogin function
  const onLogin = async (e: FormEvent) => {
    e.preventDefault()

    try {
      // Type for userCredential is UserCredential
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      // Signed in
      const user = userCredential.user

      // Navigate to home page if signed in
      if (user) {
        navigate("/home")
      }
    } catch (error) {
      // Type for error is AuthError
      const authError: AuthError | any = error
      const errorCode = authError.code
      // const errorMessage = authError.message;

      // Handle error (e.g., show error message)
      console.error("Error during sign-in:", errorCode)
    }
  }

  return (
    <>
      <main>
        <section>
          <div>
            <p>FocusApp</p>

            <form onSubmit={onLogin}>
              <div>
                <label htmlFor="email-address">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />
              </div>

              <div>
                <button type="submit">Login</button>
              </div>
            </form>

            <p className="text-sm text-white text-center">
              No account yet? <NavLink to="/signup">Sign up</NavLink>
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
