import { useState, ChangeEvent } from "react"
import { NavLink } from "react-router-dom"
import { useUser } from "src/hooks/user"

const SignUpPage = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const { signUp } = useUser()

  return (
    <main>
      <section>
        <div>
          <div>
            <h1>FocusApp</h1>
            <form onSubmit={() => signUp(email, password)}>
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

export default SignUpPage
