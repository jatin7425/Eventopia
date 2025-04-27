import React from 'react'
import { Calendar, Hash, Text, SquarePower, Link2, List } from 'lucide-react'

export const DataTypeIcon = ({ value }) => {
    const getType = () => {
        if (typeof value === 'number') return 'number'
        if (typeof value === 'boolean') return 'boolean'
        if (Date.parse(value)) return 'date'
        if (Array.isArray(value)) return 'array'
        if (typeof value === 'object') return 'object'
        return 'string'
    }

    const icons = {
        number: <Hash size={14} />,
        boolean: <SquarePower size={14} />,
        date: <Calendar size={14} />,
        array: <List size={14} />,
        object: <Link2 size={14} />,
        string: <Text size={14} />
    }

    return <span className="opacity-70">{icons[getType()]}</span>
}