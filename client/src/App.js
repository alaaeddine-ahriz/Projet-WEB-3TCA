// All import statements should be at the top of the file
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WeatherApp } from './Components/WeatherApp/WeatherApp';
import Login from './Components/Login/Login';
import './App.css';
import Signup from './Components/Signup/Signup';
import { CookiesProvider, useCookies } from 'react-cookie'
import Nopage from './Components/Nopage/Nopage';
import Dashboard from './Components/Dashboard/Dashboard';
// Export default can also be here or at the bottom of the file, both are fine.
export default App;

function App() {

  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  function handleLogin(user) {
    setCookie('user', user, { path: '/' })
    setIsLoggedIn(true);
  }
  function handleLogout() {
    removeCookie('user', { path: '/' });
    setIsLoggedIn(false);
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {cookies.user? (
            <>
              <Route index element={<WeatherApp user={cookies.user} />} />
              <Route path="/dashboard" element={<Dashboard user={cookies.user.user} onLogout={handleLogout} />} />
              <Route path="*" element={<Nopage />} />
            </>
          ) : (
            <>
              <Route index element={<WeatherApp user={cookies.user} />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Signup />} />
              <Route path="*" element={<Nopage />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );

}
