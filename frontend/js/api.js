/**
 * api.js
 * Centralized API helper functions to handle REST API calls to the FastAPI backend.
 */

const API_BASE_URL = 'http://127.0.0.1:8000';

// Display alert messages on pages that have #alert-container
function showAlert(message, type = 'error') {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 5000);
    } else {
        // Fallback if no container exists
        if(type === 'error') alert(message);
    }
}

// Get the stored JWT token
function getToken() {
    return localStorage.getItem('access_token');
}

// Common headers
function getHeaders(isFormData = false) {
    const headers = {};
    const token = getToken();
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    
    return headers;
}

// Handle API response and errors
async function handleResponse(response, endpoint = '') {
    // Only redirect to login for 401 if we are not already trying to login
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('access_token');
        window.location.href = 'login.html';
        throw new Error('Session expired. Please login again.');
    }
    
    let data;
    try {
        data = await response.json();
    } catch (e) {
        if (!response.ok) {
            if (response.status === 401) throw new Error('Invalid email or password.');
            if (response.status === 422) throw new Error('Please enter a valid email and password.');
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return null; // Empty response (e.g. 204 No Content)
    }

    if (!response.ok) {
        let errorMsg = 'Something went wrong. Please try again.';
        
        // Custom overrides based on user requirements
        if (response.status === 422) {
            errorMsg = "Please enter a valid email and password.";
        } else if (response.status === 401) {
            errorMsg = "Invalid email or password.";
        } else if (data.detail) {
            if (typeof data.detail === 'string') {
                errorMsg = data.detail;
            } else if (Array.isArray(data.detail) && data.detail.length > 0) {
                errorMsg = data.detail[0].msg || errorMsg;
            }
        }
        throw new Error(errorMsg);
    }

    return data;
}

// GET Request
async function apiGet(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: getHeaders()
        });
        return await handleResponse(response, endpoint);
    } catch (error) {
        console.error('API GET Error:', error);
        if (error.name === 'TypeError') throw new Error("Unable to connect to the server.");
        throw error;
    }
}

// POST Request
async function apiPost(endpoint, body, isFormData = false) {
    try {
        const options = {
            method: 'POST',
            headers: getHeaders(isFormData),
        };
        
        if (body) {
            options.body = isFormData ? body : JSON.stringify(body);
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        return await handleResponse(response, endpoint);
    } catch (error) {
        console.error('API POST Error:', error);
        if (error.name === 'TypeError') throw new Error("Unable to connect to the server.");
        throw error;
    }
}

// PUT Request
async function apiPut(endpoint, body) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(body)
        });
        return await handleResponse(response, endpoint);
    } catch (error) {
        console.error('API PUT Error:', error);
        if (error.name === 'TypeError') throw new Error("Unable to connect to the server.");
        throw error;
    }
}

// DELETE Request
async function apiDelete(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await handleResponse(response, endpoint);
    } catch (error) {
        console.error('API DELETE Error:', error);
        if (error.name === 'TypeError') throw new Error("Unable to connect to the server.");
        throw error;
    }
}

// Authentication Check Helper
function requireAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = 'login.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('access_token');
    window.location.href = 'login.html';
}
