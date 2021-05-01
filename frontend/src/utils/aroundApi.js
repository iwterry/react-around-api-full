import Api from './Api';

class AroundApi extends Api {
  _token;

  setToken(token) {
    this._token = token;
  }

  getToken() {
    return 'Bearer ' + this._token;
  }

  signup(email, password) {
    return this.fetchData({
      relativePathFromBase: 'signup',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
  }

  signin(email, password) {
    return this.fetchData({
      relativePathFromBase: 'signin',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
  }

  checkIfUserIsLoggedIn() {
    return this.fetchData({
      relativePathFromBase: 'is-token-valid',
      credentials: 'include',
    });
  }

  signout() {
    return this.fetchData({
      relativePathFromBase: 'signout',
      headers: {
        'Authorization': this.getToken(),
      },
      credentials: 'include',
    })
  }

  getInitialCards() {
    return this.fetchData({
      relativePathFromBase: 'cards',
      headers: {
        'Authorization': this.getToken(),
      }
    });
  }

  getUserProfile() {
    return this.fetchData({
      relativePathFromBase: 'users/me',
      headers: {
        'Authorization': this.getToken(),
      }
    });
  }

  createCard(name, link) {
    return this.fetchData({ 
      relativePathFromBase: 'cards',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.getToken(),
      },
      body: JSON.stringify({ name, link })
    });
  }

  updateUserProfile(name, about) {
    return this.fetchData({ 
      relativePathFromBase: 'users/me',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.getToken(),
      },
      body: JSON.stringify({ name, about })
    });
  }

  deleteCard(cardId) {
    return this.fetchData({ 
      relativePathFromBase:  `cards/${cardId}`,
      method: 'DELETE',
      headers: {
        'Authorization': this.getToken(),
      }
    });
  }

  updateUserAvatar(avatarLink) {
    return this.fetchData({ 
      relativePathFromBase: 'users/me/avatar',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.getToken(),
      },
      body: JSON.stringify({ avatar: avatarLink })
    });
  }

  updateCardLikes(cardId, isLiking ) {
    return this.fetchData({ 
      relativePathFromBase: `cards/${cardId}/likes`,
      method: (isLiking ? 'PUT' : 'DELETE'),
      headers: {
        'Authorization': this.getToken(),
      }
    });
  }
}

let baseUrl ='http://localhost:3001';

if(process.env.NODE_ENV === 'production') {
  baseUrl = 'https://api.practicum-iwterry.students.nomoreparties.site';
}

export default new AroundApi(
  baseUrl,
);