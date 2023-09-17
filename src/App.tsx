import "./App.css"
import { NoteBlock } from "./components/NoteBlock"
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NoteBlock />} />
          <Route path="/:id" element={<NoteBlock />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
