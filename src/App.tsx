import "./App.css"
// import { NoteBlock } from "./components/NoteBlock"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SignUpPage } from "./pages/signup.tsx"
import { LoginPage } from "./pages/login.tsx"
import { HomePage } from "./pages/index.tsx"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/:id" element={<NoteBlock />} /> */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
