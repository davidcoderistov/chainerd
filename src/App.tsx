import React, { useState } from 'react'
import { ThemeContext, themes } from './config'
import { BrowserRouter as Router } from 'react-router-dom'
import HomePage from './pages/HomePage'

function App() {

  const [darkTheme, setTheme] = useState<boolean>(true)

  const handleChangeTheme = (dark: boolean) => {
      setTheme(dark)
  }

  return (
      <ThemeContext.Provider value={{ theme: darkTheme ? themes.dark : themes.light, changeTheme: handleChangeTheme, dark: darkTheme }}>
          <Router>
              <HomePage />
          </Router>
      </ThemeContext.Provider>
  )
}

export default App
