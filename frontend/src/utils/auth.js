// utils/auth.js

// SAVE BOTH TOKENS
export const saveTokens = (tokens) => {
    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
};

// CLEAR TOKENS
export const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

// GET ACCESS TOKEN
export const getAccessToken = () => {
    return localStorage.getItem("access_token");
};

// AUTH FETCH (AUTO TOKEN ATTACH)
export const authFetch = (url, options = {}) => {
    const token = getAccessToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(url, {
        ...options,
        headers,
    });
};