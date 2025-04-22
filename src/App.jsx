import { useState, useEffect } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { ThemeProvider } from './context/ThemeContext'
import { TaskProvider } from './context/TaskContext'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import CalendarView from './pages/CalendarView'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on mobile when changing view
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }, [currentView])

  // Handle drag end for task reordering
  const handleDragEnd = (result) => {
    // This will be implemented in TaskContext.jsx
  }

  return (
    <ThemeProvider>
      <TaskProvider>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="min-h-screen flex flex-col">
            <Header 
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar 
                currentView={currentView}
                setCurrentView={setCurrentView}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
              />
              <main className="flex-1 overflow-auto p-4 md:p-6">
                {currentView === 'dashboard' && <Dashboard />}
                {currentView === 'calendar' && <CalendarView />}
              </main>
            </div>
          </div>
        </DragDropContext>
      </TaskProvider>
    </ThemeProvider>
  )
}

export default App