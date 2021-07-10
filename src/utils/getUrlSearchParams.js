const getUrlSearchParams = (params = [], search) => {
    let result = null

    if (params.length > 0) {
        const urlParams = new URLSearchParams(search)
        params.forEach(p => {
            const _p = urlParams.get(p)

            if (_p) {
                if (!result) result = {}
                result[p] = _p
            }
        })
    }

    return result
}

export default getUrlSearchParams
