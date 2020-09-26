class Auth {
  constructor() {
    this._baseUrl = 'https://auth.nomoreparties.co'
  }

  register(pass, email) {
    return fetch(`${this._baseUrl}/signup`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "password": pass,
        "email": email
      })
    })
      .then((res) => {
        console.log(res);
        try {
          if (res.status === 201){
            return res.json();
          }
        } catch(err){
          return (err);
        }
      })
      .then(res => {
        return res;
      })
  }

  singIn(pass, email) {
    return fetch(`${this._baseUrl}/signin`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "password": pass,
        "email": email
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          return data;
        } else {
          return;
        }
      })
  }

  getContent(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
  }
}

export const auth = new Auth();
