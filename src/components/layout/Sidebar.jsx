import { FiHome, FiCalendar, FiClock, FiCheckCircle, FiFilter, FiTag, FiAlertCircle } from 'react-icons/fi'
import { useTasks } from '../../context/TaskContext'

function Sidebar({ currentView, setCurrentView, isOpen, setIsOpen }) {
  const { 
    filter, 
    setFilter, 
    allTags, 
    selectedTags,
    setSelectedTags,
    tasks
  } = useTasks()
  
  // Count tasks for badges
  const countTasks = (filterType) => {
    switch (filterType) {
      case 'all':
        return tasks.length
      case 'active':
        return tasks.filter(task => !task.completed).length
      case 'completed':
        return tasks.filter(task => task.completed).length
      case 'today':
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return tasks.filter(task => {
          if (!task.dueDate) return false
          const dueDate = new Date(task.dueDate)
          dueDate.setHours(0, 0, 0, 0)
          return dueDate.getTime() === today.getTime()
        }).length
      case 'upcoming':
        const tomorrow = new Date()
        tomorrow.setHours(0, 0, 0, 0)
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tasks.filter(task => {
          if (!task.dueDate) return false
          const dueDate = new Date(task.dueDate)
          dueDate.setHours(0, 0, 0, 0)
          return dueDate.getTime() >= tomorrow.getTime()
        }).length
      case 'overdue':
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        return tasks.filter(task => {
          if (!task.dueDate || task.completed) return false
          const dueDate = new Date(task.dueDate)
          dueDate.setHours(0, 0, 0, 0)
          return dueDate.getTime() < now.getTime()
        }).length
      case 'high-priority':
        return tasks.filter(task => task.priority === 'high').length
      default:
        return 0
    }
  }

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  // Close sidebar on mobile when clicking outside
  const handleBackdropClick = (e) => {
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }

  const navItemClass = (navFilter) => {
    return `flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium 
      ${filter === navFilter
        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      } 
      transition-colors duration-200 cursor-pointer`
  }

  const tagItemClass = (tag) => {
    return `flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium 
      ${selectedTags.includes(tag)
        ? 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      } 
      transition-colors duration-200 cursor-pointer`
  }

  const viewClass = (view) => {
    return `flex items-center px-3 py-2 rounded-md text-sm font-medium 
      ${currentView === view
        ? 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      } 
      transition-colors duration-200 cursor-pointer`
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-20"
          onClick={handleBackdropClick}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 fixed md:static inset-y-0 left-0 z-30
          w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          overflow-y-auto transform transition-transform duration-300 ease-in-out
        `}
      >
        <div className="py-6 px-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Views</h2>
          <nav className="space-y-1 mb-6">
            <div 
              className={viewClass('dashboard')}
              onClick={() => setCurrentView('dashboard')}
            >
              <FiHome className="mr-3 h-5 w-5" />
              Dashboard
            </div>
            <div 
              className={viewClass('calendar')}
              onClick={() => setCurrentView('calendar')}
            >
              <FiCalendar className="mr-3 h-5 w-5" />
              Calendar
            </div>
          </nav>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h2>
          <nav className="space-y-1 mb-6">
            <div 
              className={navItemClass('all')}
              onClick={() => setFilter('all')}
            >
              <div className="flex items-center">
                <FiFilter className="mr-3 h-5 w-5" />
                All Tasks
              </div>
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                {countTasks('all')}
              </span>
            </div>
            <div 
              className={navItemClass('active')}
              onClick={() => setFilter('active')}
            >
              <div className="flex items-center">
                <FiClock className="mr-3 h-5 w-5" />
                Active
              </div>
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                {countTasks('active')}
              </span>
            </div>
            <div 
              className={navItemClass('completed')}
              onClick={() => setFilter('completed')}
            >
              <div className="flex items-center">
                <FiCheckCircle className="mr-3 h-5 w-5" />
                Completed
              </div>
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                {countTasks('completed')}
              </span>
            </div>
            <div 
              className={navItemClass('today')}
              onClick={() => setFilter('today')}
            >
              <div className="flex items-center">
                <FiCalendar className="mr-3 h-5 w-5" />
                Today
              </div>
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                {countTasks('today')}
              </span>
            </div>
            <div 
              className={navItemClass('upcoming')}
              onClick={() => setFilter('upcoming')}
            >
              <div className="flex items-center">
                <FiCalendar className="mr-3 h-5 w-5" />
                Upcoming
              </div>
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                {countTasks('upcoming')}
              </span>
            </div>
            <div 
              className={navItemClass('overdue')}
              onClick={() => setFilter('overdue')}
            >
              <div className="flex items-center">
                <FiAlertCircle className="mr-3 h-5 w-5 text-error-500" />
                Overdue
              </div>
              <span className="px-2 py-0.5 text-xs rounded-full bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200">
                {countTasks('overdue')}
              </span>
            </div>
            <div 
              className={navItemClass('high-priority')}
              onClick={() => setFilter('high-priority')}
            >
              <div className="flex items-center">
                <FiAlertCircle className="mr-3 h-5 w-5 text-warning-500" />
                High Priority
              </div>
              <span className="px-2 py-0.5 text-xs rounded-full bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200">
                {countTasks('high-priority')}
              </span>
            </div>
          </nav>

          {allTags.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h2>
              <nav className="space-y-1">
                {allTags.map(tag => (
                  <div 
                    key={tag}
                    className={tagItemClass(tag)}
                    onClick={() => handleTagClick(tag)}
                  >
                    <div className="flex items-center">
                      <FiTag className="mr-3 h-5 w-5" />
                      {tag}
                    </div>
                  </div>
                ))}
              </nav>
            </>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar