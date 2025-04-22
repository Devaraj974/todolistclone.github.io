import { useTasks } from '../../context/TaskContext'
import TaskItem from './TaskItem'
import { Droppable } from 'react-beautiful-dnd'
import { FiInbox } from 'react-icons/fi'

function TaskList() {
  const { getFilteredTasks } = useTasks()
  const filteredTasks = getFilteredTasks()
  
  // If no tasks are found
  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
          <FiInbox className="h-12 w-12 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No tasks found</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Try changing your filters or create a new task to get started.
        </p>
      </div>
    )
  }
  
  return (
    <Droppable droppableId="tasks">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="mt-3"
        >
          {filteredTasks.map((task, index) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              index={index} 
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

export default TaskList