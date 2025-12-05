import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './router/AppRoutes'
import { Toaster } from 'react-hot-toast'
import './App.css'   // ✅ Add this line

function App() {
  return (
    <Router>
      <Toaster 
        position="top-center"
        reverseOrder={false}
      />
      <AppRoutes />
    </Router>
  )
}

export default App
