import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useTasks } from '../../context/TaskContext'
import { FiMenu, FiPlus, FiMoon, FiSun, FiSearch } from 'react-icons/fi'
import TaskForm from '../tasks/TaskForm'
import SearchBar from '../filters/SearchBar'

function Header({ sidebarOpen, setSidebarOpen }) {
  const { darkMode, toggleDarkMode } = useTheme()
  const { searchQuery, setSearchQuery } = useTasks()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showSearchOnMobile, setShowSearchOnMobile] = useState(false)

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and menu button */}
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-expanded={sidebarOpen}
            >
              <span className="sr-only">Open main menu</span>
              <FiMenu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 flex items-center ml-4">
              <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">TaskMaster</h1>
            </div>
          </div>

          {/* Middle - Search (hidden on mobile unless activated) */}
          <div className={`flex-1 max-w-md mx-4 ${showSearchOnMobile ? 'flex' : 'hidden md:flex'}`}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setShowSearchOnMobile(!showSearchOnMobile)}
            >
              <span className="sr-only">{showSearchOnMobile ? 'Hide search' : 'Show search'}</span>
              <FiSearch className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={toggleDarkMode}
            >
              <span className="sr-only">{darkMode ? 'Light mode' : 'Dark mode'}</span>
              {darkMode ? (
                <FiSun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <FiMoon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              className="btn btn-primary flex items-center space-x-1"
              onClick={() => setShowTaskForm(true)}
            >
              <FiPlus className="h-4 w-4" />
              <span className="hidden md:inline">Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task form modal */}
      {showTaskForm && (
        <TaskForm 
          isOpen={showTaskForm} 
          onClose={() => setShowTaskForm(false)}
        />
      )}
    </header>
  )
}

export default Header