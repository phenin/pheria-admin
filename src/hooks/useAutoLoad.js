import { useEffect, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'

export default function useAutoLoad(func, immediate = true, time = 10000) {
    const dispatch = useDispatch()
    const [ loader, setLoader ] = useState(null)
    const [ isRunning, setRunning ] = useState(immediate)

    const handleKillLoader = useCallback(() => {
        if (loader) {
            clearTimeout(loader)
        }
    }, [loader])

    const handleStartLoader = useCallback((value) => {
        setRunning(value)
        if (!value) {
            handleKillLoader()
        }
    }, [handleKillLoader])

    useEffect(() => {
        if (isRunning) {
            const _loader = setInterval(() => {
                dispatch(func())
            }, time)
            
            setLoader(_loader)
        }
    }, [ dispatch, func, setLoader, isRunning, time ])

    useEffect(() => {
        return () => {
            handleKillLoader()
        }
    }, [handleKillLoader])

    return [ isRunning, handleStartLoader, handleKillLoader ]
}
