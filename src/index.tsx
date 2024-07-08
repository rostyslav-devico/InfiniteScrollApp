import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import HomePage from './pages/homePage/index'
import DetailsPage from './pages/detailsPage/index'
import { SnackbarProvider } from 'notistack'

const rootDocument = document.getElementById('root')
const root = ReactDOM.createRoot(rootDocument!)
root.render(
  <SnackbarProvider maxSnack={3}>
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/item/:id" element={<DetailsPage />} />
        </Routes>
      </Router>
    </React.StrictMode>
  </SnackbarProvider>,
)
