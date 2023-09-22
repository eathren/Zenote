import "./App.css"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SignUpPage } from "src/pages/signup.tsx"
import { LoginPage } from "src/pages/login.tsx"
import { HomePage } from "src/pages/index.tsx"
import { BasicLayout } from "src/layout/layout.tsx"
import { SubPage } from "src/pages/subpage"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <BasicLayout>
                <HomePage />
              </BasicLayout>
            }
          />
          <Route
            path="/:id"
            element={
              <BasicLayout>
                <SubPage />
              </BasicLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <BasicLayout>
                <SignUpPage />
              </BasicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <BasicLayout>
                <LoginPage />
              </BasicLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
