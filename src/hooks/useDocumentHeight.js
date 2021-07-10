import { useEffect, useCallback } from 'react'
import useMedia from 'hooks/useMedia'

export default function useDocumentHeight() {
    const isMobile = useMedia(['(max-width: 480px)'], [true], false);

    const setDocumentHeight = useCallback(() => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);
    }, [])

    useEffect(() => {
      if (isMobile) {
        setDocumentHeight()

        window.addEventListener('resize', setDocumentHeight);
        window.addEventListener('orientationchange', setDocumentHeight);
      }
      else {
        window.removeEventListener('resize', setDocumentHeight)
        window.removeEventListener('orientationchange', setDocumentHeight)
      }
    }, [setDocumentHeight, isMobile])
}
