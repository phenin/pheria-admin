export const COOKIE_EXPIRES_MAX_AGE__3M = 90

export const ENABLE_JWT_REFRESH_TOKEN = false

export const ERROR_CODES = {
    NOT_AUTHORIZED: { code: 'NOT_AUTHORIZED', http_code: 401, description: "Not authorized, please check and try again."},
    REFRESH_TOKEN_HAS_EXPIRED: { code: 'REFRESH_TOKEN_HAS_EXPIRED', http_code: 401, description: "Your token has expired, please sign in again."},
    REFRESH_TOKEN_NOT_FOUND: { code: 'REFRESH_TOKEN_NOT_FOUND', http_code: 404, description: "Refresh token not found"},
    TOTAL_PAY_NOT_VALID: { code: 'TOTAL_PAY_NOT_VALID', http_code: 402, description: "Total pay not valid"},
    NOT_ENOUGH_CREDIT: { code: 'NOT_ENOUGH_CREDIT', http_code: 406, description: "Not enough credit"},
    TOKEN_NOT_FOUND: { code: 'TOKEN_NOT_FOUND', http_code: 404, description: "Token does not exist in system"},
}
