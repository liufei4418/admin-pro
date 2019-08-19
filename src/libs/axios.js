import axios from 'axios'

class HttpRequest {
  // eslint-disable-next-line no-undef
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        token:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NjI0ODU0OTYsImV4cCI6MTU2MjUxNDI5NiwiaXNzIjoic2VydmVyIiwiYXVkIjoiY2xpZW50IiwidXNlciI6eyJ1c2VyIjp7InVzZXJfaWQiOiIxIiwicGhvbmUiOiIxNzYwOTg1MDQxOSIsImlzdmVyaWZ5IjoiMCIsImRlZmF1bHRfY29tbXVuaXR5aWQiOiIxMTExNSJ9LCJ1c2VyX2NvbW11bml0eSI6W3sicnVsZV9pZCI6IjExMSIsImRheXRpbWVzIjoiMiIsImNvbW11bml0eV9pZCI6IjExMTExIiwiY29tbXVuaXR5X25hbWUiOiJcdTZkNGJcdThiZDVcdTVjMGZcdTUzM2EifV0sImFwcGtleSI6IjI1RjlFNzk0MzIzQjQ1Mzg4NUY1MTgxRjFCNjI0RDBCIn19.c8CogV8AJ9qDPiXiH7puzgjuuXa7jP98Pu7lGUj_ZXQ'
      }
    }
    return config
  }
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // Spin.show() // 不建议开启，因为界面不友好
        }
        this.queue[url] = true
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        this.destroy(url)
        const { data, status } = res
        return { data, status }
      },
      error => {
        this.destroy(url)
        let errorInfo = error.response
        if (!errorInfo) {
          const {
            request: { statusText, status },
            config
          } = JSON.parse(JSON.stringify(error))
          errorInfo = {
            statusText,
            status,
            request: { responseURL: config.url }
          }
        }
        return Promise.reject(error)
      }
    )
  }
  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
