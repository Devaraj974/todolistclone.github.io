import { useState } from 'react'
import { useTasks } from '../../context/TaskContext'
import { format, isPast, isToday } from 'date-fns'
import { 
  FiMoreVertical, 
  FiEdit2, 
  FiTrash2, 
  FiCalendar,
  FiClock,
  FiTag,
  FiChevronDown,
  FiRepeat,
  FiAlertCircle,
  FiAlertTriangle,
  FiCircle
} from 'react-icons/fi'
import { Draggable } from 'react-beautiful-dnd'
import TaskForm from './TaskForm'
import SubtaskList from './SubtaskList'

function TaskItem({ task, index }) {
  const { 
    toggleTaskCompletion, 
    deleteTask, 
    toggleSubtaskCompletion 
  } = useTasks()
  
  const [showDropdown, setShowDropdown] = useState(false)
  const [showSubtasks, setShowSubtasks] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  
  // Calculate completion percentage based on subtasks
  const completionPercentage = task.subtasks.length 
    ? Math.round((task.subtasks.filter(sub => sub.completed).length / task.subtasks.length) * 100) 
    : (task.completed ? 100 : 0)
  
  // Handle due date display
  const getDueDateElement = () => {
    if (!task.dueDate) return null
    
    const dueDate = new Date(task.dueDate)
    const isPastDue = isPast(dueDate) && !isToday(dueDate) && !task.completed
    
    return (
      <div 
        className={`flex items-center text-sm
          ${isPastDue 
            ? 'text-error-600 dark:text-error-400' 
            : 'text-gray-600 dark:text-gray-400'
          }`}
      >
        <FiCalendar className="h-4 w-4 mr-1" />
        <span>
          {isToday(dueDate) 
            ? 'Today' 
            : format(dueDate, 'MMM d, yyyy')}
          {isPastDue && ' (Overdue)'}
        </span>
      </div>
    )
  }

  // Handle priority indicator
  const getPriorityElement = () => {
    switch(task.priority) {
      case 'high':
        return (
          <div className="flex items-center text-error-600 dark:text-error-400">
            <FiAlertCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">High</span>
          </div>
        )
      case 'medium':
        return (
          <div className="flex items-center text-warning-600 dark:text-warning-400">
            <FiAlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-sm">Medium</span>
          </div>
        )
      case 'low':
      default:
        return (
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <FiCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">Low</span>
          </div>
        )
    }
  }
  
  // Handle more options dropdown
  const handleDropdownToggle = (e) => {
    e.stopPropagation()
    setShowDropdown(!showDropdown)
  }
  
  // Handle edit action
  const handleEdit = (e) => {
    e.stopPropagation()
    setShowDropdown(false)
    setShowEditForm(true)
  }
  
  // Handle delete action with confirmation
  const handleDelete = (e) => {
    e.stopPropagation()
    setShowDropdown(false)
    
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id)
    }
  }
  
  // Toggle subtasks visibility
  const toggleSubtasksVisibility = (e) => {
    e.stopPropagation()
    setShowSubtasks(!showSubtasks)
  }
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 rounded-lg shadow-sm overflow-hidden
            ${task.completed 
              ? 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700' 
              : 'bg-white dark:bg-gray-800 shadow-md'
            } 
            transition-all duration-300`}
        >
          <div 
            className={`relative p-4
              ${task.completed && 'opacity-75'}
            `}
          >
            {/* Task header */}
            <div className="flex items-start">
              {/* Checkbox */}
              <div className="flex-shrink-0 mr-3 pt-1">
                <div 
                  className={`h-5 w-5 rounded-full border cursor-pointer flex items-center justify-center transition-colors
                    ${task.completed 
                      ? 'bg-primary-500 border-primary-500' 
                      : 'border-gray-400 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500'
                    }`}
                  onClick={() => toggleTaskCompletion(task.id)}
                >
                  {task.completed && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              
              {/* Task content */}
              <div className="flex-1 min-w-0">
                <h3 
                  className={`text-lg font-medium ${task.completed && 'line-through text-gray-500 dark:text-gray-400'}`}
                >
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                    {task.description}
                  </p>
                )}
                
                {/* Task metadata */}
                <div className="mt-3 flex flex-wrap gap-3">
                  {getPriorityElement()}
                  {getDueDateElement()}
                  
                  {task.isRecurring && (
                    <div className="flex items-center text-secondary-600 dark:text-secondary-400 text-sm">
                      <FiRepeat className="h-4 w-4 mr-1" />
                      <span className="capitalize">{task.recurringType}</span>
                    </div>
                  )}
                  
                  {task.reminderDate && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <FiClock className="h-4 w-4 mr-1" />
                      <span>{format(new Date(task.reminderDate), 'MMM d, h:mm a')}</span>
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                {task.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {task.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="badge badge-secondary"
                      >
                        <FiTag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Progress bar for subtasks */}
                {task.subtasks.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{completionPercentage}% Complete</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 transition-all duration-300"
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {/* Show subtasks button */}
                {task.subtasks.length > 0 && (
                  <button
                    className="mt-3 text-sm flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                    onClick={toggleSubtasksVisibility}
                  >
                    <FiChevronDown 
                      className={`h-4 w-4 mr-1 transition-transform ${showSubtasks ? 'rotate-180' : ''}`} 
                    />
                    {showSubtasks ? 'Hide' : 'Show'} subtasks ({task.subtasks.length})
                  </button>
                )}
              </div>
              
              {/* Task actions */}
              <div className="ml-4 flex-shrink-0 relative">
                <button
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleDropdownToggle}
                >
                  <FiMoreVertical className="h-5 w-5" />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 py-1 animate-fade-in">
                    <button 
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={handleEdit}
                    >
                      <FiEdit2 className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button 
                      className="flex w-full items-center px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={handleDelete}
                    >
                      <FiTrash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Subtasks section */}
          {showSubtasks && task.subtasks.length > 0 && (
            <div className="px-4 pb-3 pt-0 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
              <SubtaskList 
                subtasks={task.subtasks} 
                taskId={task.id}
                onToggle={toggleSubtaskCompletion}
              />
            </div>
          )}

          {/* Edit form modal */}
          {showEditForm && (
            <TaskForm 
              isOpen={showEditForm} 
              onClose={() => setShowEditForm(false)} 
              taskToEdit={task}
            />
          )}
        </div>
      )}
    </Draggable>
  )
}

export default TaskItem