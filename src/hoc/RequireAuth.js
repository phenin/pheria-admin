import React from 'react'
import { Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import useRequireAuth from '../hooks/useRequireAuth'

import { getCookie, setCookie } from 'utils/util'

const RequireAuth = (props, config = {}, ContextProvider) => (Component) => {
    const { specifyService, isRequireAdmin } = config

    function WrappedComponent() {
        const dispatch = useDispatch()
        let token = ''

        // get token in search params
        if (URLSearchParams) {
            const urlParams = new URLSearchParams(props.location.search);
            token = urlParams.get('token')
        }

        // get token in cookies
        if (!token) {
          const cToken = getCookie('accessToken')
          if (cToken) token = cToken
        }

        const { isChecking, isAuth, isAdmin, profile } = useRequireAuth(token)

        if (isChecking) {
            return <div>Loading...</div>
        }
        else {
            if (
                (!isRequireAdmin || (isRequireAdmin && isAdmin))
                && isAuth
                && (!specifyService || (specifyService && isAdmin)) ) {

                if (ContextProvider) {
                    return <ContextProvider token={token}>
                        <Component
                            {...props}
                            token={token}
                            admin={isAdmin}
                            specifyService={specifyService}
                        />
                    </ContextProvider>
                }
                else {
                    return <Component
                        {...props}
                        token={token}
                        admin={isAdmin}
                        specifyService={specifyService}
                    />
                }

            }
            else {
                return <Redirect to='/login' />
            }
        }
    }

    return WrappedComponent
}

export default RequireAuth
