import Api from "./Api";

class AppDataApi extends Api {
  getInitialCards() {
    return this.fetchData({ relativePathFromBase: 'cards' });
  }

  getUserProfile() {
    return this.fetchData({ relativePathFromBase: 'users/me' });
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
      relativePathFromBase: `cards/likes/${cardId}`,
      method: (isLiking ? 'PUT' : 'DELETE')
    });
  }
}

const authToken = 'f9c51bc0-ecec-42b1-bdb4-bcfabdba3e4f';

const appDataApi = new AppDataApi({
  baseUrl: 'https://around.nomoreparties.co/v1/group-8', 
  headers: { 
    authorization: authToken 
  }
});

export default appDataApi;