import { useState, useEffect } from 'react'
// import { getUserProfile } from 'api/user'

function useRequireAuth(token) {
    const [isChecking, setChecking] = useState(true)
    const [isAuth, setAuth] = useState(false)
    const [isAdmin, setAdmin] = useState(false)
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        if (token) {
            setAuth(true)
            setChecking(false)
            // getUserProfile({ token })
            //     .then(data => {
            //         setProfile(data)
            //         if (data.role && data.role === 'admin') {
            //             setAdmin(true)
            //         }
            //         setAuth(true)
            //         setChecking(false)
            //     })
            //     .catch(() => {
            //         setChecking(false)
            //     });

        }
        else {
            setChecking(false)
        }
    }, [token])

    return {
      isChecking,
      isAuth,
      isAdmin,
      profile
    }
}

export default useRequireAuth
