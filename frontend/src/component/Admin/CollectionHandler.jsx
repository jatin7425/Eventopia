import React, { Fragment, useEffect, useState } from 'react'
import { useAdmin } from '../../store/adminContext'
import { useParams } from 'react-router-dom'
import { FilterBuilder } from './FilterBuilder'
import { Pagination } from './Pagination'
import { DataTypeIcon } from './DataTypeIcon'
import { ChevronDown, ChevronUp, Edit, Filter, Trash, X } from 'lucide-react'

function CollectionHandler() {
    const { collection } = useParams()
    const { getCollectionData, updateCollectionItem, CollectionData, setCollectionData, deleteCollectionItem, loading, error } = useAdmin()
    const [localFilters, setLocalFilters] = useState({})
    const [appliedFilters, setAppliedFilters] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [showFilters, setShowFilters] = useState(false)
    const [expandedRows, setExpandedRows] = useState(new Set())
    const [ShowDeleteModal, setShowDeleteModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const toggleShowDeleteModal = () => setShowDeleteModal(!ShowDeleteModal)

    // Centralized data fetching
    const fetchData = async () => {
        if (collection) {
            const data = await getCollectionData(collection, currentPage, pageSize, appliedFilters)
            setCollectionData(data)
        }
    }

    useEffect(() => {
        fetchData()
    }, [collection, currentPage, pageSize, appliedFilters])

    const handleApplyFilters = () => {
        setAppliedFilters(localFilters)
        setCurrentPage(1)
        setShowFilters(false)
    }

    const handleFilterChange = (field, value) => {
        setLocalFilters(prev => {
            const updated = {
                ...prev,
                [field]: value === 'all' ? undefined : value
            };
            return updated;
        });
    }

    const clearFilters = () => {
        setLocalFilters({})
        setAppliedFilters({})
        setCurrentPage(1)
    }

    const toggleRowExpand = (id) => {
        const newExpanded = new Set(expandedRows)
        newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id)
        setExpandedRows(newExpanded)
    }

    if (!collection) return <div className="p-4">Select a collection</div>
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>
    if (!CollectionData?.data) return <div className="p-4">No data found</div>

    const handleUpdateClick = (item) => {
        setSelectedItem(item);
        setShowUpdateModal(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateCollectionItem(collection, selectedItem._id, selectedItem);
            setShowUpdateModal(false);
            await getCollectionData(collection);
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setSelectedItem(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="sm:p-4 p-1 w-full">
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
                    {Object.keys(appliedFilters).length > 0 && (
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
                    filterOptions={CollectionData.filterOptions}
                    currentFilters={localFilters}
                    onFilterChange={handleFilterChange}
                    onApply={handleApplyFilters}
                />
            )}

            <div className="overflow-x-auto rounded-lg border dark:border-zinc-700 w-full">
                <table className="w-full">
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
                                    .slice(0, 5)
                                    .map((key) => (
                                        <th key={key} className="px-4 py-3 text-left text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <DataTypeIcon value={CollectionData.data[0][key]} />
                                                {key}
                                            </div>
                                        </th>
                                    ))}
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
                                        .slice(0, 5)
                                        .map(([key, value]) => (
                                            <td key={key} className="px-4 py-2 max-w-xs truncate">
                                                {value?.toString()}
                                            </td>
                                        ))}
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

const DeleteModal = ({ collection, id, deleteCollectionItem, toggleShowDeleteModal }) => {
    const handleYes = () => {
        deleteCollectionItem(collection, id)
        toggleShowDeleteModal()
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-zinc-800 p-4 rounded">
                <h2 className="text-lg font-semibold mb-2">Delete Collection</h2>
                <p className="text-gray-600">Are you sure you want to delete this collection?</p>
                <div className="flex justify-end mt-4"></div>
                <button
                    onClick={handleYes}
                    className="mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Yes
                </button>
                <button
                    onClick={toggleShowDeleteModal}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    No
                </button>
            </div>
        </div>
    )
}

export default CollectionHandler