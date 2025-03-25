const apiConfig = {
    baseUrl: 'https://prod.sost.in/',
    
    getUrl(endpoint) {
      const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      return `${this.baseUrl}${path}`;
    }
  };
  
  export default apiConfig;