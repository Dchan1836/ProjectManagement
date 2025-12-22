import React from 'react';
// import { Link } from 'react-router-dom'
// import { NavLink } from 'react-router-dom';
// import { BrowserRouter, Routes, Route } from "react-router";
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { SignUpPage } from './components/SignUpPage';
import { LogInPage } from './components/LogInPage';
import { UserInfoPage } from './components/UserInfoPage';
import { MyGantt } from "./components/MyGantt.tsx";
import { Home } from './components/Home.tsx';
import { MyKanban } from './components/MyKanban.tsx';
import { MyGanttSVAR } from './components/MyGanttSVAR.jsx';
import { TestGantt } from './components/TestGantt.tsx';
import './App.css';
function App() {
    const myState = {initial:"Hello from App"};
  return (
    <>
      <header className="navbar">
        <h1>Program Manager</h1>
        <nav>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          <Link to="/gantt" className={location.pathname === '/gantt' ? 'active' : ''}>
            Gantt
          </Link>
          <Link to="/kanban" className={location.pathname === '/kanban' ? 'active' : ''}>
            Kanban
          </Link>
          <Link to="/ganttSVAR" className={location.pathname === '/gantt-svar' ? 'active' : ''} title="Not recomended to use">
            Gantt SVAR
          </Link>
          <Link to="/TestGantt" className={location.pathname === '/TestGantt' ? 'active' : ''} title="Not recomended to use">
          Test Gantt
        </Link>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gantt" element={<MyGantt myState={myState}/>} />
          <Route path="/kanban" element={<MyKanban myState={myState} />} />
          <Route path="/ganttSVAR" element={<MyGanttSVAR />} />
          <Route path="/TestGantt" element={<TestGantt />} />
        </Routes>
      </main>
    </>
  )
}

export default App
