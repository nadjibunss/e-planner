import React, { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Cek apakah pengguna sudah login sebelumnya
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setUser(data);
        }
      });
  }, []);

  const responseGoogle = (response) => {
    console.log(response);
    const tokenId = response.credential;
    fetch('/auth/google/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenId }),
    })
    .then(res => res.json())
    .then(data => {
        console.log('Login success:', data);
        setUser(data);
    })
    .catch(error => {
        console.error('Login error:', error);
    });
  };

  const logout = () => {
    fetch('/api/logout', { method: 'POST' })
      .then(() => {
        googleLogout();
        setUser(null);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        {user ? (
          <div>
            <h1>Selamat Datang, {user.name}</h1>
            <p>Email: {user.email}</p>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <div>
            <h1>Selamat Datang di e-planner</h1>
            <GoogleLogin
              onSuccess={responseGoogle}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
