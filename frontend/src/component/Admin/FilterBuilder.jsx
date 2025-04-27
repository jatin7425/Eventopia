import React from 'react'

export const FilterBuilder = ({ filterOptions, currentFilters, onFilterChange, onApply }) => {
    const normalizedOptions = Object.entries(filterOptions || {}).flatMap(([field, options]) => {
        if (typeof options === 'object' && !Array.isArray(options)) {
            return Object.entries(options).map(([nestedField, nestedOptions]) => ({
                field: `${field}.${nestedField}`,
                options: Array.isArray(nestedOptions) ? nestedOptions : []
            }))
        }
        return [{
            field,
            options: Array.isArray(options) ? options : []
        }]
    })

    if (normalizedOptions.length === 0) {
        return <div className="text-gray-500 p-4">No filter options available</div>
    }

    return (
        <div className='w-full py-4 flex flex-col items-center'>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-2 w-full">
                {normalizedOptions.map(({ field, options }) => (
                    <div key={field} className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
                        <label className="block text-sm font-medium mb-2 capitalize">{field}</label>
                        <select
                            value={currentFilters[field] || 'all'}
                            onChange={(e) => onFilterChange(field, e.target.value)}
                            className="w-full p-2 rounded border dark:bg-zinc-700"
                        >
                            <option value="all">All</option>
                            {options.map(option => (
                                <option key={option} value={option}>
                                    {option.toString()}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
            <button
                onClick={onApply}
                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded w-full sm:w-[95%] transition-colors'
            >
                Apply Filters
            </button>
        </div>
    )
}