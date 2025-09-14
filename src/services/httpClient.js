// HTTP客户端封装
import { getCurrentConfig, HTTP_STATUS, ERROR_MESSAGES } from './apiConfig';

class HttpClient {
  constructor() {
    this.config = getCurrentConfig();
    this.baseURL = this.config.baseURL;
    this.timeout = this.config.timeout;
  }

  // 获取当前配置的baseURL
  getBaseURL() {
    const config = JSON.parse(localStorage.getItem('api_config') || '{}');
    return config.baseURL || this.baseURL;
  }

  // 获取认证token
  getAuthToken() {
    return localStorage.getItem('auth_token');
  }

  // 设置认证token
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // 构建完整URL
  buildURL(endpoint, params = {}) {
    let url = `${this.getBaseURL()}${endpoint}`;
    
    // 替换URL参数
    Object.keys(params).forEach(key => {
      url = url.replace(`:${key}`, params[key]);
    });
    
    return url;
  }

  // 构建请求头
  buildHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    // 添加认证token
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // 处理响应
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error = new Error(data.message || ERROR_MESSAGES[response.status] || ERROR_MESSAGES.UNKNOWN);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  // 处理错误
  handleError(error) {
    console.error('API Error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        message: ERROR_MESSAGES.NETWORK_ERROR,
        error: error.message,
      };
    }

    if (error.name === 'AbortError') {
      return {
        success: false,
        message: ERROR_MESSAGES.TIMEOUT,
        error: error.message,
      };
    }

    return {
      success: false,
      message: error.message || ERROR_MESSAGES.UNKNOWN,
      status: error.status,
      error: error.message,
    };
  }

  // 创建AbortController用于超时控制
  createAbortController() {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), this.timeout);
    return controller;
  }

  // GET请求
  async get(endpoint, params = {}, options = {}) {
    try {
      const url = this.buildURL(endpoint, params);
      const controller = this.createAbortController();
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.buildHeaders(options.headers),
        signal: controller.signal,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // POST请求
  async post(endpoint, data = {}, params = {}, options = {}) {
    try {
      const url = this.buildURL(endpoint, params);
      const controller = this.createAbortController();
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.buildHeaders(options.headers),
        body: JSON.stringify(data),
        signal: controller.signal,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // PUT请求
  async put(endpoint, data = {}, params = {}, options = {}) {
    try {
      const url = this.buildURL(endpoint, params);
      const controller = this.createAbortController();
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.buildHeaders(options.headers),
        body: JSON.stringify(data),
        signal: controller.signal,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // DELETE请求
  async delete(endpoint, params = {}, options = {}) {
    try {
      const url = this.buildURL(endpoint, params);
      const controller = this.createAbortController();
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.buildHeaders(options.headers),
        signal: controller.signal,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // PATCH请求
  async patch(endpoint, data = {}, params = {}, options = {}) {
    try {
      const url = this.buildURL(endpoint, params);
      const controller = this.createAbortController();
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.buildHeaders(options.headers),
        body: JSON.stringify(data),
        signal: controller.signal,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // 文件上传
  async upload(endpoint, file, params = {}, options = {}) {
    try {
      const url = this.buildURL(endpoint, params);
      const controller = this.createAbortController();
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...this.buildHeaders(),
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
        signal: controller.signal,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// 创建单例实例
const httpClient = new HttpClient();

export default httpClient;
