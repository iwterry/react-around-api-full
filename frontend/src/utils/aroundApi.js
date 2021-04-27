import Api from './Api';

class AroundApi extends Api {
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

  getEmail() {
    return this.getUserProfile().then(({ email }) => email);
  }

  getInitialCards() {
    return this.fetchData({
      relativePathFromBase: 'cards'
    });
  }

  getUserProfile() {
    return this.fetchData({
      relativePathFromBase: 'users/me'
    });
  }

  createCard(name, link) {
    return this.fetchData({ 
      relativePathFromBase: 'cards',
      method: 'POST',
      additionalHeaderProps: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, link })
    });
  }

  updateUserProfile(name, about) {
    return this.fetchData({ 
      relativePathFromBase: 'users/me',
      method: 'PATCH',
      additionalHeaderProps: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, about })
    });
  }

  deleteCard(cardId) {
    return this.fetchData({ 
      relativePathFromBase:  `cards/${cardId}`,
      method: 'DELETE'
    });
  }

  updateUserAvatar(avatarLink) {
    return this.fetchData({ 
      relativePathFromBase: 'users/me/avatar',
      method: 'PATCH',
      additionalHeaderProps: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ avatar: avatarLink })
    });
  }

  updateCardLikes(cardId, isLiking ) {
    return this.fetchData({ 
      relativePathFromBase: `cards/${cardId}/likes`,
      method: (isLiking ? 'PUT' : 'DELETE')
    });
  }
}

export default new AroundApi(
  'https://api.practicum-iwterry.students.nomoreparties.site',
  { credentials: 'include' }
);