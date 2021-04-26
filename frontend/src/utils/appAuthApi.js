import Api from "./Api";

class AppAuthApi extends Api {
  signup(email, password) {
    return this.fetchData({
      relativePathFromBase: 'signup',
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  signin(email, password) {
    return this.fetchData({
      relativePathFromBase: 'signin',
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  getEmail(token) {
    return this.fetchData({
      relativePathFromBase: 'users/me',
      additionalHeaderProps: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
}

const appAuthApi = new AppAuthApi({
  baseUrl: 'https://register.nomoreparties.co',
  headers: { 
    'Content-Type': 'application/json' 
  }
});

export default appAuthApi;