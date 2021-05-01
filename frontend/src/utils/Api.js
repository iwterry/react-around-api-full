class Api { // trying to keep this class as generic as possible for reusability
  constructor(baseUrl, { headers={}, ...others }={}) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    this._others = others;
  }

  fetchData({
    relativePathFromBase='',
    method='GET',
    headers={},
    body=null,
    ...others
  }) {
    const allHeaders = { ...this._headers, ...headers };
    const allOthers = { ...this._others, ...others };
    const init = { method, headers: allHeaders, ...allOthers};
    const resource = `${this._baseUrl}/${relativePathFromBase}`;

    if(body !== null) {
      init.body = body;
    }

    return fetch(resource, init).then((res) => {
      if(res.ok) {
        if(res.status === 204 || res.headers.get('Content-Length') === '0') return Promise.resolve(null);

        const contentType = res.headers.get('Content-Type');
        if(contentType && contentType.startsWith('application/json')) return res.json();
        
        return res.text();
      }
      else return Promise.reject(res.status);
    });
  }
}

export default Api;