import { useTasks } from '../../context/TaskContext'

function SubtaskList({ subtasks, taskId }) {
  const { toggleSubtaskCompletion, deleteSubtask } = useTasks()
  
  return (
    <ul className="space-y-1.5">
      {subtasks.map(subtask => (
        <li key={subtask.id} className="flex items-center">
          <div 
            className={`h-4 w-4 rounded-sm border cursor-pointer flex items-center justify-center transition-colors
              ${subtask.completed 
                ? 'bg-primary-500 border-primary-500' 
                : 'border-gray-400 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500'
              }`}
            onClick={() => toggleSubtaskCompletion(taskId, subtask.id)}
          >
            {subtask.completed && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span 
            className={`ml-2 text-sm ${subtask.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}
          >
            {subtask.title}
          </span>
          <button
            className="ml-auto text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => deleteSubtask(taskId, subtask.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default SubtaskList