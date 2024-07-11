import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import HomePage from './pages/Home/index'
import DetailsPage from './pages/Details/index'
import { SnackbarProvider } from 'notistack'
import { DataProvider } from './services/DataContext'
import { UI_URL } from './constants'

const rootDocument = document.getElementById('root')
const root = ReactDOM.createRoot(rootDocument!)
root.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3}>
      <DataProvider>
        <Router>
          <Routes>
            <Route path={UI_URL.root} element={<HomePage />} />
            <Route path={UI_URL.item} element={<DetailsPage />} />
          </Routes>
        </Router>
      </DataProvider>
    </SnackbarProvider>
  </React.StrictMode>,
)
