import { FiFilter, FiChevronDown, FiX } from 'react-icons/fi'
import { useState } from 'react'
import { useTasks } from '../../context/TaskContext'

function FilterBar() {
  const { 
    sortBy, 
    setSortBy, 
    sortDirection, 
    setSortDirection,
    selectedTags,
    setSelectedTags,
    allTags,
    filter,
    setFilter,
    resetFilters
  } = useTasks()
  
  const [showSortOptions, setShowSortOptions] = useState(false)
  
  const handleSortChange = (option) => {
    if (sortBy === option) {
      // Toggle direction if same option is selected
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new sort option with default asc direction
      setSortBy(option)
      setSortDirection('asc')
    }
    setShowSortOptions(false)
  }
  
  const handleTagRemove = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag))
  }
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-4">
      <div className="flex flex-wrap items-center mb-3 sm:mb-0">
        <span className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
          <FiFilter className="h-4 w-4 mr-1" />
          Filters:
        </span>
        
        {/* Show active filter */}
        {filter !== 'all' && (
          <span className="badge badge-primary flex items-center mr-2 mb-2 sm:mb-0">
            {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
            <button 
              className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setFilter('all')}
            >
              <FiX className="h-3 w-3" />
            </button>
          </span>
        )}
        
        {/* Show selected tags */}
        {selectedTags.map(tag => (
          <span key={tag} className="badge badge-secondary flex items-center mr-2 mb-2 sm:mb-0">
            {tag}
            <button 
              className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => handleTagRemove(tag)}
            >
              <FiX className="h-3 w-3" />
            </button>
          </span>
        ))}
        
        {/* Reset button - only show if filters are active */}
        {(filter !== 'all' || selectedTags.length > 0) && (
          <button 
            className="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 ml-1"
            onClick={resetFilters}
          >
            Reset
          </button>
        )}
      </div>
      
      {/* Sort options */}
      <div className="relative">
        <button
          className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded"
          onClick={() => setShowSortOptions(!showSortOptions)}
        >
          Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
          <FiChevronDown className={`ml-1 h-4 w-4 transition-transform ${showSortOptions ? 'rotate-180' : ''}`} />
        </button>
        
        {showSortOptions && (
          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 py-1">
            <div 
              className={`px-4 py-2 text-sm cursor-pointer ${sortBy === 'date' ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => handleSortChange('date')}
            >
              Creation Date {sortBy === 'date' && (sortDirection === 'asc' ? '(Oldest first)' : '(Newest first)')}
            </div>
            <div 
              className={`px-4 py-2 text-sm cursor-pointer ${sortBy === 'dueDate' ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => handleSortChange('dueDate')}
            >
              Due Date {sortBy === 'dueDate' && (sortDirection === 'asc' ? '(Earliest first)' : '(Latest first)')}
            </div>
            <div 
              className={`px-4 py-2 text-sm cursor-pointer ${sortBy === 'priority' ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => handleSortChange('priority')}
            >
              Priority {sortBy === 'priority' && (sortDirection === 'asc' ? '(Low to High)' : '(High to Low)')}
            </div>
            <div 
              className={`px-4 py-2 text-sm cursor-pointer ${sortBy === 'alphabetical' ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => handleSortChange('alphabetical')}
            >
              Alphabetical {sortBy === 'alphabetical' && (sortDirection === 'asc' ? '(A-Z)' : '(Z-A)')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterBar