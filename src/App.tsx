import { Routes, Route } from "react-router-dom"
import SignUpPage from "src/pages/SignupPage"
import LoginPage from "src/pages/LoginPage"
import { HomePage } from "src/pages/index.tsx"
import { BasicLayout } from "src/layout/layout.tsx"
import { FlowPage } from "./pages/flow"
import GraphPage from "./pages/GraphPage"
import NodePage from "./pages/NodePage"
import { useUser } from "./hooks/user"
import LandingPage from "./pages/LandingPage"
import "./App.css"

function App() {
  const { user } = useUser()

  return (
    <>
      <Routes>
        {/* Show LandingPage as landing page if user is not logged in */}
        {!user ? (
          <Route
            path="/"
            element={
              <BasicLayout>
                <LandingPage />
              </BasicLayout>
            }
          />
        ) : (
          <>
            <Route
              path="/"
              element={
                <BasicLayout>
                  <HomePage />
                </BasicLayout>
              }
            />
            <Route
              path="/:graphId"
              element={
                <BasicLayout>
                  <GraphPage />
                </BasicLayout>
              }
            />
            <Route
              path="/:graphId/:nodeId"
              element={
                <BasicLayout>
                  <NodePage />
                </BasicLayout>
              }
            />
            <Route
              path="/flow"
              element={
                <BasicLayout>
                  <FlowPage />
                </BasicLayout>
              }
            />
          </>
        )}
        {/* Common routes that are always accessible */}
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
    </>
  )
}

export default App
