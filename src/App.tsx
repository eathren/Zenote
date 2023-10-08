import { Routes, Route } from "react-router-dom"
import SignUpPage from "src/pages/SignupPage"
import LoginPage from "src/pages/LoginPage"
import { HomePage } from "src/pages/index"
import { BasicLayout } from "src/layout/layout"
import GraphPage from "./pages/GraphPage"
import NodePage from "./pages/NodePage"
import { useUser } from "./hooks/user"
import LandingPage from "./pages/LandingPage"
import { useLoadingStore } from "./stores/loadingStore"
import "./App.css"
import { ConfigProvider, theme } from "antd"

const { darkAlgorithm } = theme

function App() {
  const { user } = useUser()
  const { isLoadingUserAuth } = useLoadingStore()

  // Show a loading state while user auth status is being determined
  if (isLoadingUserAuth) {
    return <div>Loading...</div>
  }

  return (
    <ConfigProvider theme={{ algorithm: darkAlgorithm }}>
      <Routes>
        {/* Conditionally render routes based on user authentication */}
        {user ? (
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
          </>
        ) : (
          <>
            <Route
              path="/"
              element={
                <BasicLayout>
                  <LandingPage />
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
          </>
        )}
        {/* 404 page. Place it at the bottom so it only matches if no other routes match */}
        <Route
          path="*"
          element={
            <BasicLayout>
              <h1>404</h1>
            </BasicLayout>
          }
        />
      </Routes>
    </ConfigProvider>
  )
}

export default App
