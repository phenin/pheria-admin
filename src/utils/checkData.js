export const isValidOption = (options = [], value) => {
    const index = options.findIndex(o => o.value === value)

    return index !== -1
}

export const isValidTime = (value) => {
    const date = new Date(value)

    return date.toDateString !== 'Invalid Date'
}

const optionsBoolean = ['true', 'false']

export const isValidBoolean = (value) => {
    return typeof value === 'boolean' || optionsBoolean.includes(value)
}
