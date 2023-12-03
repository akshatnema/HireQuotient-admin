import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { Flowbite } from 'flowbite-react'
import type { CustomFlowbiteTheme } from 'flowbite-react'
import Home from './pages/Home'
import './App.css'

function App() {
  const customTheme: CustomFlowbiteTheme = {
    table: {
        root: {
            wrapper: "bg-white"
        },
        head: {
            cell: {
                base: "text-white bg-gray-800 border-gray-700",
            }
        },
        body: {
            cell: {
                base: "text-gray-800"
            }
        }
    }
}

  return (
    <>
    <Flowbite theme={{theme: customTheme}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
      </Flowbite>
    </>
  )
}

export default App
