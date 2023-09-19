import "./App.css"
// import { NoteBlock } from "./components/NoteBlock"
import { BrowserRouter, Routes, Route, Router } from "react-router-dom"
import { SignUpPage } from "src/pages/signup.tsx"
import { LoginPage } from "src/pages/login.tsx"
import { HomePage } from "src/pages/index.tsx"
import { BasicLayout } from "src/layout/layout.tsx"
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
          {/* <Route path="/:id" element={<NoteBlock />} /> */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
