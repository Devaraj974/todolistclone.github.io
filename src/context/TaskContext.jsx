import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

const TaskContext = createContext()

export function useTasks() {
  return useContext(TaskContext)
}

export function TaskProvider({ children }) {
  // Main state for tasks
  const [tasks, setTasks] = useState([])
  
  // UI states
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortDirection, setSortDirection] = useState('asc')
  const [selectedTags, setSelectedTags] = useState([])
  
  // Get all unique tags from all tasks
  const allTags = [...new Set(tasks.flatMap(task => task.tags))]
    .filter(tag => tag && tag.trim() !== '')
    .sort()

  // Load tasks from localStorage on initial load
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error)
        setTasks([])
      }
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Add a new task
  const addTask = (taskData) => {
    const newTask = {
      id: uuidv4(),
      title: taskData.title,
      description: taskData.description || '',
      completed: false,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      tags: taskData.tags || [],
      subtasks: taskData.subtasks || [],
      createdAt: new Date().toISOString(),
      isRecurring: taskData.isRecurring || false,
      recurringType: taskData.recurringType || null,
      reminderDate: taskData.reminderDate || null
    }
    
    setTasks(prevTasks => [...prevTasks, newTask])
  }

  // Update an existing task
  const updateTask = (taskId, updatedData) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updatedData } : task
      )
    )
  }

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
  }

  // Toggle task completion status
  const toggleTaskCompletion = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  // Add a subtask to a task
  const addSubtask = (taskId, subtaskTitle) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: [
              ...task.subtasks,
              {
                id: uuidv4(),
                title: subtaskTitle,
                completed: false
              }
            ]
          }
        }
        return task
      })
    )
  }

  // Toggle subtask completion
  const toggleSubtaskCompletion = (taskId, subtaskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.map(subtask => 
              subtask.id === subtaskId 
                ? { ...subtask, completed: !subtask.completed } 
                : subtask
            )
          }
        }
        return task
      })
    )
  }

  // Delete a subtask
  const deleteSubtask = (taskId, subtaskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
          }
        }
        return task
      })
    )
  }

  // Reorder tasks (for drag and drop)
  const reorderTasks = (startIndex, endIndex) => {
    const reorderedTasks = Array.from(tasks)
    const [removed] = reorderedTasks.splice(startIndex, 1)
    reorderedTasks.splice(endIndex, 0, removed)
    setTasks(reorderedTasks)
  }

  // Reset all filters
  const resetFilters = () => {
    setFilter('all')
    setSearchQuery('')
    setSortBy('date')
    setSortDirection('asc')
    setSelectedTags([])
  }

  // Filter tasks based on current filter, search query, and selected tags
  const getFilteredTasks = useCallback(() => {
    return tasks
      .filter(task => {
        // Filter by completion status
        if (filter === 'completed' && !task.completed) return false
        if (filter === 'active' && task.completed) return false
        
        // Filter by due date
        if (filter === 'today') {
          if (!task.dueDate) return false
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const dueDate = new Date(task.dueDate)
          dueDate.setHours(0, 0, 0, 0)
          if (dueDate.getTime() !== today.getTime()) return false
        }
        
        if (filter === 'upcoming') {
          if (!task.dueDate) return false
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const dueDate = new Date(task.dueDate)
          dueDate.setHours(0, 0, 0, 0)
          if (dueDate.getTime() <= today.getTime()) return false
        }
        
        if (filter === 'overdue') {
          if (!task.dueDate) return false
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const dueDate = new Date(task.dueDate)
          dueDate.setHours(0, 0, 0, 0)
          if (dueDate.getTime() >= today.getTime() || task.completed) return false
        }
        
        // Filter by priority
        if (filter === 'high-priority' && task.priority !== 'high') return false
        
        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          const matchesTitle = task.title.toLowerCase().includes(query)
          const matchesDesc = task.description.toLowerCase().includes(query)
          const matchesTags = task.tags.some(tag => tag.toLowerCase().includes(query))
          if (!matchesTitle && !matchesDesc && !matchesTags) return false
        }
        
        // Filter by selected tags
        if (selectedTags.length > 0) {
          if (!task.tags.some(tag => selectedTags.includes(tag))) return false
        }
        
        return true
      })
      .sort((a, b) => {
        // Sort by the selected sort option
        if (sortBy === 'date') {
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
        }
        
        if (sortBy === 'dueDate') {
          // Handle null dueDate values
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return sortDirection === 'asc' ? 1 : -1
          if (!b.dueDate) return sortDirection === 'asc' ? -1 : 1
          
          const dateA = new Date(a.dueDate).getTime()
          const dateB = new Date(b.dueDate).getTime()
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
        }
        
        if (sortBy === 'priority') {
          const priorityMap = { high: 3, medium: 2, low: 1 }
          const priorityA = priorityMap[a.priority] || 0
          const priorityB = priorityMap[b.priority] || 0
          return sortDirection === 'asc' ? priorityA - priorityB : priorityB - priorityA
        }
        
        if (sortBy === 'alphabetical') {
          return sortDirection === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
        }
        
        return 0
      })
  }, [tasks, filter, searchQuery, selectedTags, sortBy, sortDirection])

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    addSubtask,
    toggleSubtaskCompletion,
    deleteSubtask,
    reorderTasks,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    selectedTags,
    setSelectedTags,
    allTags,
    resetFilters,
    getFilteredTasks
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}