import { FiPlus } from 'react-icons/fi'

function EmptyState({ onCreateTask }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <img 
        src="https://images.pexels.com/photos/3299/postit-scrabble-to-do.jpg?auto=compress&cs=tinysrgb&w=600" 
        alt="Empty task list" 
        className="w-64 h-64 object-cover rounded-lg mb-6 shadow-md"
      />
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
        No tasks yet
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        Get started by creating your first task. Stay organized and boost your productivity!
      </p>
      <button 
        onClick={onCreateTask}
        className="btn btn-primary flex items-center"
      >
        <FiPlus className="h-5 w-5 mr-2" />
        Create your first task
      </button>
    </div>
  )
}

export default EmptyState