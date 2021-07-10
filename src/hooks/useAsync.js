import { useState, useCallback, useEffect, useRef } from 'react'

const defaultConfig = {
    immediate: true,
    clearDataWhenExecute: true
}

const useAsync = (asyncFunction, _config = {}) => {
    const config = { ...defaultConfig, ..._config }
    const { immediate, clearDataWhenExecute } = config

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    const isFirstRender = useRef(true)

    // params is newest parameter used in api
    const execute = useCallback((params) => {
        setLoading(true)
        setError(null)
        if (clearDataWhenExecute) setData(null)

        // pass params to asyncFunction
        return asyncFunction(params)
            .then(response => setData(response))
            .catch(error => {
                setError(error)
                setData(null)
            })
            .finally(() => setLoading(false))
    }, [asyncFunction, clearDataWhenExecute])

    useEffect(() => {
        if (immediate && isFirstRender.current) {
            isFirstRender.current = false
            execute()
        }
    }, [execute, immediate])

    const clear = () => {
        setData(null)
    }

    return [
        {
            loading,
            error,
            data,
        },
        execute,
        clear
    ]
}

export default useAsync
