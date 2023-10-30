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
import { Helmet } from "react-helmet"
import "./App.css"

import { ReactNode } from "react"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import SettingsPage from "./pages/SettingsPage"

const { darkAlgorithm } = theme
// const { TabPane } = Tabs
// ProtectedRoute component to handle route protection
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useUser()

  if (loading) {
    return <Spin>Loading...</Spin>
  }

  return user ? children : <Navigate to="/login" replace />
}

function App() {
  const { user, loading } = useUser()
  if (loading) {
    return (
      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm,
          token: {
            colorLink: "#ffffff",
          },
        }}
      >
        <BasicLayout>
          <Spin
            style={{ position: "absolute", left: "50%", top: "50%" }}
          ></Spin>
        </BasicLayout>
      </ConfigProvider>
    )
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: darkAlgorithm,
        token: {
          colorPrimary: "#353535",
          colorInfo: "#353535",
        },
      }}
    >
      <Helmet>
        <meta charSet="utf-8" />
        <Helmet>
          <title>
            Zenote - A Note-Taking App Designed to Mimic How Your Brain Works
          </title>
          <meta
            name="description"
            content="Welcome to Zenote, your one-stop solution for note-taking and knowledge management. Capture ideas as nodes, make connections, and collaborate in real-time."
          />
          <meta
            name="keywords"
            content="Zenote, Note-taking, Brain, Nodes, Connections, Obsidian, Notion, Collaboration, Online-First, Tables, Sharing, Knowledge Management"
          />
          <meta name="author" content="Zenote Team" />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://zenote.com/" />
          <meta
            property="og:title"
            content="Zenote - A Note-Taking App Designed to Mimic How Your Brain Works"
          />
          <meta
            property="og:description"
            content="Welcome to Zenote, your one-stop solution for note-taking and knowledge management. Capture ideas as nodes, make connections, and collaborate in real-time."
          />
          <meta property="og:image" content="https://zenote.com/og-image.jpg" />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://zenote.com/" />
          <meta
            property="twitter:title"
            content="Zenote - A Note-Taking App Designed to Mimic How Your Brain Works"
          />
          <meta
            property="twitter:description"
            content="Welcome to Zenote, your one-stop solution for note-taking and knowledge management. Capture ideas as nodes, make connections, and collaborate in real-time."
          />
          <meta
            property="twitter:image"
            content="https://zenote.com/twitter-image.jpg"
          />
        </Helmet>
      </Helmet>
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
