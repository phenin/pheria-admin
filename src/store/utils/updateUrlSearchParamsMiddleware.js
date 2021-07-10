import {
    
} from 'constant'

const MAPPING = {
    
}

const updateUrlSearchParamsMiddleware = () => (next) => (action) => {
    if (action.payload) {
        let searchParams = []
        Object.keys(action.payload).forEach(key => {
            const searchParam = Object.keys(MAPPING).find(i => MAPPING[i] === key)
            if (searchParam) {
                searchParams.push({
                    key: searchParam,
                    value: action.payload[`${key}_search_param`] || action.payload[key]
                })
            }
        })

        if (searchParams.length > 0) {
            let urlParams = new URLSearchParams(window.location.search)

            searchParams.forEach(({ key, value }) => {
                if (value) urlParams.set(key, value)
                else urlParams.delete(key)
            })

            const newUrl = new URL(window.location.href)
            newUrl.search = `?${urlParams.toString()}`

            window.history.replaceState({ path: newUrl.href }, '', newUrl.href)
        }
    }

    return next(action);

}

export default updateUrlSearchParamsMiddleware
