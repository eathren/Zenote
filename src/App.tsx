import "./App.css"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignUpPage from "src/pages/SignupPage"
import LoginPage from "src/pages/LoginPage"
import { HomePage } from "src/pages/index.tsx"
import { BasicLayout } from "src/layout/layout.tsx"
import { FlowPage } from "./pages/flow"
import GraphPage from "./pages/GraphPage"
import NodePage from "./pages/NodePage"

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
