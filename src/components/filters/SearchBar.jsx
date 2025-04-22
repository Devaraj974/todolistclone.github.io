import { FiSearch, FiX } from 'react-icons/fi'

function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input pl-10 pr-10"
        placeholder="Search tasks, tags, or descriptions..."
      />
      {value && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          onClick={() => onChange('')}
        >
          <FiX className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

export default SearchBar