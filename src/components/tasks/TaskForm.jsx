import { useState, useEffect } from 'react'
import { useTasks } from '../../context/TaskContext'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { 
  FiX, 
  FiCalendar, 
  FiClock, 
  FiRepeat, 
  FiTag, 
  FiPlus,
  FiAlertTriangle,
  FiAlertCircle,
  FiCircle
} from 'react-icons/fi'

function TaskForm({ isOpen, onClose, taskToEdit = null }) {
  const { addTask, updateTask, allTags } = useTasks()
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState(null)
  const [priority, setPriority] = useState('medium')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringType, setRecurringType] = useState('daily')
  const [reminderDate, setReminderDate] = useState(null)
  const [subtaskInput, setSubtaskInput] = useState('')
  const [subtasks, setSubtasks] = useState([])
  
  // UI state
  const [showRecurringOptions, setShowRecurringOptions] = useState(false)
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  
  // Populate form if editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '')
      setDescription(taskToEdit.description || '')
      setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : null)
      setPriority(taskToEdit.priority || 'medium')
      setTags(taskToEdit.tags || [])
      setIsRecurring(taskToEdit.isRecurring || false)
      setRecurringType(taskToEdit.recurringType || 'daily')
      setReminderDate(taskToEdit.reminderDate ? new Date(taskToEdit.reminderDate) : null)
      setSubtasks(taskToEdit.subtasks || [])
      setShowRecurringOptions(taskToEdit.isRecurring || false)
    }
  }, [taskToEdit])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const taskData = {
      title,
      description,
      dueDate: dueDate ? dueDate.toISOString() : null,
      priority,
      tags,
      isRecurring,
      recurringType: isRecurring ? recurringType : null,
      reminderDate: reminderDate ? reminderDate.toISOString() : null,
      subtasks
    }
    
    if (taskToEdit) {
      updateTask(taskToEdit.id, taskData)
    } else {
      addTask(taskData)
    }
    
    onClose()
  }
  
  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }
  
  const handleSelectExistingTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag])
    }
    setShowTagDropdown(false)
    setTagInput('')
  }
  
  const handleAddSubtask = () => {
    if (subtaskInput.trim() !== '') {
      setSubtasks([
        ...subtasks,
        { id: Date.now().toString(), title: subtaskInput.trim(), completed: false }
      ])
      setSubtaskInput('')
    }
  }
  
  const handleSubtaskKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSubtask()
    }
  }
  
  const handleRemoveSubtask = (subtaskId) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== subtaskId))
  }
  
  const filteredTags = allTags.filter(tag => 
    !tags.includes(tag) && tag.toLowerCase().includes(tagInput.toLowerCase())
  )
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto z-10 animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">
            {taskToEdit ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" onClick={onClose}>
            <FiX className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="Task title"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input min-h-[80px]"
              placeholder="Task description"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={dueDate}
                  onChange={setDueDate}
                  className="input pl-10"
                  placeholderText="Select due date"
                  dateFormat="MMM d, yyyy"
                  isClearable
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FiCalendar className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center space-x-1 ${
                    priority === 'low' 
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setPriority('low')}
                >
                  <FiCircle className="h-4 w-4" />
                  <span>Low</span>
                </button>
                
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center space-x-1 ${
                    priority === 'medium' 
                      ? 'bg-warning-200 dark:bg-warning-900 text-warning-800 dark:text-warning-200' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setPriority('medium')}
                >
                  <FiAlertTriangle className="h-4 w-4" />
                  <span>Medium</span>
                </button>
                
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center space-x-1 ${
                    priority === 'high' 
                      ? 'bg-error-200 dark:bg-error-900 text-error-800 dark:text-error-200' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setPriority('high')}
                >
                  <FiAlertCircle className="h-4 w-4" />
                  <span>High</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FiTag className="h-4 w-4 mr-1" />
              Tags
            </label>
            <div className="relative">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="input pr-10"
                placeholder="Add tags"
                onFocus={() => setShowTagDropdown(true)}
                onBlur={() => setTimeout(() => setShowTagDropdown(false), 200)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={handleAddTag}
              >
                <FiPlus className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
              
              {/* Tags dropdown */}
              {showTagDropdown && filteredTags.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-40 overflow-auto">
                  {filteredTags.map(tag => (
                    <div
                      key={tag}
                      className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleSelectExistingTag(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Tags list */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="badge badge-secondary flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <FiRepeat className="h-4 w-4 mr-1" />
                Recurring Task
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => {
                    setIsRecurring(e.target.checked)
                    setShowRecurringOptions(e.target.checked)
                  }}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            {showRecurringOptions && (
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md animate-fade-in">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className={`flex-1 py-1 px-2 rounded-md text-sm ${
                      recurringType === 'daily' 
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200' 
                        : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                    onClick={() => setRecurringType('daily')}
                  >
                    Daily
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-1 px-2 rounded-md text-sm ${
                      recurringType === 'weekly' 
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200' 
                        : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                    onClick={() => setRecurringType('weekly')}
                  >
                    Weekly
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-1 px-2 rounded-md text-sm ${
                      recurringType === 'monthly' 
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200' 
                        : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                    onClick={() => setRecurringType('monthly')}
                  >
                    Monthly
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FiClock className="h-4 w-4 mr-1" />
              Reminder
            </label>
            <div className="relative">
              <DatePicker
                selected={reminderDate}
                onChange={setReminderDate}
                showTimeSelect
                dateFormat="MMM d, yyyy h:mm aa"
                className="input pl-10"
                placeholderText="Set a reminder"
                isClearable
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiClock className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subtasks
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={handleSubtaskKeyDown}
                className="input flex-1"
                placeholder="Add a subtask"
              />
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleAddSubtask}
              >
                Add
              </button>
            </div>
            
            {/* Subtasks list */}
            {subtasks.length > 0 && (
              <ul className="mt-3 space-y-2">
                {subtasks.map(subtask => (
                  <li 
                    key={subtask.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <span className="text-sm">{subtask.title}</span>
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      onClick={() => handleRemoveSubtask(subtask.id)}
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={title.trim() === ''}
            >
              {taskToEdit ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm