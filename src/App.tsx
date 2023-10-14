// App.tsx
import { Routes, Route, Navigate } from "react-router-dom"
import { Spin } from "antd"
import SignUpPage from "src/pages/SignupPage"
import LoginPage from "src/pages/LoginPage"
import HomePage from "src/pages/HomePage"
import GraphPage from "src/pages/GraphPage"
import NodePage from "src/pages/NodePage"
import LandingPage from "src/pages/LandingPage"
import PlaygroundPage from "./pages/PlaygroundPage"
import { useUser } from "src/hooks/user"
import { ConfigProvider, theme } from "antd"
import { BasicLayout } from "src/layout/layout"
import "./App.css"

import { ReactNode } from "react"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import SettingsPage from "./pages/SettingsPage"

const { darkAlgorithm } = theme

// ProtectedRoute component to handle route protection
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useUser()

  if (loading) {
    return <Spin>Loading...</Spin>
  }

  return user ? children : <Navigate to="/login" replace />
}

function App() {
  const { user, loading } = useUser() // Get user and loading state

  // Show loading spinner until Firebase check is complete
  if (loading) {
    return (
      <ConfigProvider theme={{ algorithm: darkAlgorithm }}>
        <BasicLayout>
          <Spin
            style={{ position: "absolute", left: "50%", top: "50%" }}
          ></Spin>
        </BasicLayout>
      </ConfigProvider>
    )
  }

  return (
    <ConfigProvider theme={{ algorithm: darkAlgorithm }}>
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <BasicLayout>
                <LandingPage />
              </BasicLayout>
            ) : (
              <ProtectedRoute>
                <BasicLayout>
                  <HomePage />
                </BasicLayout>
              </ProtectedRoute>
            )
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <BasicLayout>
                <SettingsPage />
              </BasicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/graphs/:graphId"
          element={
            <ProtectedRoute>
              <BasicLayout>
                <GraphPage />
              </BasicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/graphs/:graphId/playground"
          element={
            <ProtectedRoute>
              <BasicLayout>
                <PlaygroundPage />
              </BasicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/graphs/:graphId/node/:nodeId"
          element={
            <ProtectedRoute>
              <BasicLayout>
                <NodePage />
              </BasicLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <BasicLayout>
                <SignUpPage />
              </BasicLayout>
            )
          }
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <BasicLayout>
                <LoginPage />
              </BasicLayout>
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <BasicLayout>
                <ForgotPasswordPage />
              </BasicLayout>
            )
          }
        />
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
