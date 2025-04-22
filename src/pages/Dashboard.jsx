import { useState, useEffect } from 'react'
import { useTasks } from '../context/TaskContext'
import { DragDropContext } from 'react-beautiful-dnd'
import TaskList from '../components/tasks/TaskList'
import FilterBar from '../components/filters/FilterBar'
import EmptyState from '../components/tasks/EmptyState'
import TaskForm from '../components/tasks/TaskForm'

function Dashboard() {
  const { tasks, reorderTasks } = useTasks()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Set mounted state after first render
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Handle drag and drop
  const handleDragEnd = (result) => {
    if (!result.destination) return
    
    const { source, destination } = result
    reorderTasks(source.index, destination.index)
  }
  
  // If there are no tasks, show empty state
  if (mounted && tasks.length === 0) {
    return (
      <>
        <EmptyState onCreateTask={() => setShowTaskForm(true)} />
        
        {showTaskForm && (
          <TaskForm 
            isOpen={showTaskForm} 
            onClose={() => setShowTaskForm(false)}
          />
        )}
      </>
    )
  }
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Your Tasks
        </h1>
        
        <FilterBar />
        
        <TaskList />
        
        {showTaskForm && (
          <TaskForm 
            isOpen={showTaskForm} 
            onClose={() => setShowTaskForm(false)}
          />
        )}
      </div>
    </DragDropContext>
  )
}

export default Dashboard