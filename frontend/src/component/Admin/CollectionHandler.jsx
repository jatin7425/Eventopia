import React, { useEffect, useState } from 'react'
import { useAdmin } from '../../store/adminContext'
import { useParams } from 'react-router-dom'
import { FilterBuilder } from './FilterBuilder'
import { Pagination } from './Pagination'
import { DataTypeIcon } from './DataTypeIcon'
import { ChevronDown, ChevronUp, Edit, Filter, Trash, X } from 'lucide-react'

function CollectionHandler() {
    const { collection } = useParams()
    const { getCollectionData, CollectionData, setCollectionData, loading, error } = useAdmin()
    const [filters, setFilters] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [showFilters, setShowFilters] = useState(false)
    const [expandedRows, setExpandedRows] = useState(new Set())

    useEffect(() => {
        if (collection) {
            getCollectionData(collection, currentPage, pageSize, filters)
        }
    }, [collection, currentPage, pageSize, filters])

    const Applyfilter = () => {
        let filteredData = getCollectionData(collection, 1, pageSize, filters)
        setCollectionData(filteredData)
        setShowFilters(false)
    }

    const toggleRowExpand = (id) => {
        const newExpanded = new Set(expandedRows)
        newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id)
        setExpandedRows(newExpanded)
    }

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value === 'all' ? undefined : value
        }))
    }

    const clearFilters = () => {
        setFilters({})
        setCurrentPage(1)
    }

    if (!collection) return <div className="p-4">Select a collection</div>
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>
    if (loading) return <div className="p-4">Loading...</div>
    if (!CollectionData?.data) return <div className="p-4">No data found</div>

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold capitalize">{collection}</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-800 rounded-lg shadow"
                    >
                        <Filter size={16} />
                        {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {Object.keys(filters).length > 0 && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900 rounded-lg"
                        >
                            Clear Filters <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {showFilters && CollectionData?.filterOptions && (
                <FilterBuilder
                    filterOptions={CollectionData?.filterOptions}
                    onFilterChange={handleFilterChange}
                    currentFilters={filters}
                    Applyfilter={Applyfilter}
                />
            )}

            <div className="overflow-x-auto rounded-lg border dark:border-zinc-700 w-full min-w-[600px]">
                <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50 dark:bg-zinc-800">
                        <tr>
                            <th className="w-12"></th>
                            {CollectionData.data[0] &&
                                Object.keys(CollectionData.data[0])
                                    .filter((key) => {
                                        const value = CollectionData.data[0][key];
                                        const isMongoId = typeof value === 'string' && /^[a-f0-9]{24}$/.test(value);
                                        return (
                                            !key.startsWith('_') &&
                                            key !== 'password' &&
                                            typeof value !== 'object' &&
                                            value !== null &&
                                            !isMongoId
                                        );
                                    })
                                    .slice(0, 3)
                                    .map((key) => (
                                        <th key={key} className="px-4 py-3 text-left text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <DataTypeIcon value={CollectionData.data[0][key]} />
                                                {key}
                                            </div>
                                        </th>
                                    ))}
                            <th className="px-4 py-3 text-left text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    Update
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    Delete
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {CollectionData.data.map((item) => (
                            <React.Fragment key={item._id}>
                                <tr className="border-t dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800">
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => toggleRowExpand(item._id)}
                                            className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded"
                                        >
                                            {expandedRows.has(item._id) ? <ChevronUp /> : <ChevronDown />}
                                        </button>
                                    </td>
                                    {Object.entries(item)
                                        .filter(([key, value]) => {
                                            const isMongoId = typeof value === 'string' && /^[a-f0-9]{24}$/.test(value);
                                            return (
                                                !key.startsWith('_') &&
                                                key !== 'password' &&
                                                typeof value !== 'object' &&
                                                value !== null &&
                                                !isMongoId
                                            );
                                        })
                                        .slice(0, 3)
                                        .map(([key, value]) => (
                                            <td key={key} className="px-4 py-2 max-w-xs truncate">
                                                {value?.toString()}
                                            </td>
                                        ))}
                                    <td className="px-4 py-2 max-w-xs truncate">
                                        <button>
                                            <Edit className='text-blue-500' size={16} />
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 max-w-xs truncate">
                                        <button>
                                            <Trash className='text-red-500' size={16} />
                                        </button>
                                    </td>
                                </tr>

                                {expandedRows.has(item._id) && (
                                    <tr>
                                        <td colSpan={5}>
                                            <div className="p-4 bg-gray-50 dark:bg-zinc-900">
                                                <pre className="text-sm whitespace-pre-wrap">
                                                    {JSON.stringify(item, null, 2)}
                                                </pre>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {CollectionData.pagination && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={CollectionData.pagination.totalPages}
                    onPageChange={setCurrentPage}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                />
            )}
        </div>
    )
}

export default CollectionHandler