import { useState, ChangeEvent } from "react"
import { NavLink } from "react-router-dom"
import { useUser } from "src/hooks/user"

const LoginPage = () => {
  // State variables with explicit types
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const { signIn } = useUser()

  return (
    <>
      <main>
        <section>
          <div>
            <p>FocusApp</p>

            <form onSubmit={() => signIn(email, password)}>
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

export default LoginPage
