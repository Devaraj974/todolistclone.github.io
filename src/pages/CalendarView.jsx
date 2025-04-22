import { useState } from 'react'
import { useTasks } from '../context/TaskContext'
import DatePicker from 'react-datepicker'
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks, isWithinInterval, isSameDay } from 'date-fns'
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi'
import TaskForm from '../components/tasks/TaskForm'

function CalendarView() {
  const { tasks } = useTasks()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  
  // Create a 7-day week view starting from the current date
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }) // Start from Monday
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 }) // End on Sunday
  
  // Move to previous week
  const previousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1))
  }
  
  // Move to next week
  const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1))
  }
  
  // Generate days of the week
  const days = []
  let day = startDate
  while (day <= endDate) {
    days.push(day)
    day = addDays(day, 1)
  }
  
  // Get tasks for a specific day
  const getTasksForDay = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return isSameDay(taskDate, date)
    })
  }
  
  // Handle task click to edit
  const handleTaskClick = (task) => {
    setSelectedTask(task)
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Calendar View
        </h1>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={previousWeek}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center space-x-1 px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FiCalendar className="h-4 w-4" />
              <span>
                {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
              </span>
            </button>
            
            {showDatePicker && (
              <div className="absolute top-full right-0 mt-1 z-10">
                <DatePicker
                  selected={currentDate}
                  onChange={(date) => {
                    setCurrentDate(date)
                    setShowDatePicker(false)
                  }}
                  inline
                />
              </div>
            )}
          </div>
          
          <button
            onClick={nextWeek}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        {/* Day headers */}
        {days.map((day, index) => (
          <div
            key={index}
            className="text-center py-2 font-medium text-gray-700 dark:text-gray-300"
          >
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">
              {format(day, 'EEE')}
            </div>
            <div className={`text-sm rounded-full h-7 w-7 flex items-center justify-center mx-auto
              ${isSameDay(day, new Date()) 
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' 
                : ''
              }`}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}
        
        {/* Task cells */}
        {days.map((day, index) => {
          const dayTasks = getTasksForDay(day)
          
          return (
            <div
              key={`tasks-${index}`}
              className={`h-40 overflow-y-auto p-2 border border-gray-100 dark:border-gray-700 rounded-md
                ${isSameDay(day, new Date()) 
                  ? 'bg-primary-50 dark:bg-primary-900 dark:bg-opacity-10' 
                  : 'bg-gray-50 dark:bg-gray-800'
                }`}
            >
              {dayTasks.length > 0 ? (
                <div className="space-y-2">
                  {dayTasks.map(task => (
                    <div 
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className={`p-2 rounded cursor-pointer text-sm transition-colors
                        ${task.completed 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 line-through' 
                          : task.priority === 'high'
                            ? 'bg-error-100 dark:bg-error-900 dark:bg-opacity-30 text-error-800 dark:text-error-200'
                            : task.priority === 'medium'
                              ? 'bg-warning-100 dark:bg-warning-900 dark:bg-opacity-30 text-warning-800 dark:text-warning-200'
                              : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        } 
                        hover:opacity-80`}
                    >
                      <div className="font-medium mb-1 truncate">{task.title}</div>
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                          {task.tags.length > 2 && (
                            <span className="text-xs bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded">
                              +{task.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm italic">
                  No tasks
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Task edit modal */}
      {selectedTask && (
        <TaskForm 
          isOpen={!!selectedTask} 
          onClose={() => setSelectedTask(null)} 
          taskToEdit={selectedTask}
        />
      )}
    </div>
  )
}

export default CalendarView