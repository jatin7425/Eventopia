export const flattenObject = (obj, prefix = '') => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const prefixedKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            Object.assign(acc, flattenObject(value, prefixedKey));
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (typeof item === 'object' && item !== null) {
                    Object.assign(acc, flattenObject(item, `${prefixedKey}[${index}]`));
                } else {
                    acc[`${prefixedKey}[${index}]`] = item;
                }
            });
        } else {
            acc[prefixedKey] = value;
        }

        return acc;
    }, {});
};
