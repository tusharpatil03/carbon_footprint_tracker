import React from 'react';

function Profile() {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">No user information available.</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">Profile</div>
        <div className="card-body">
          <p><strong>Name:</strong> {user.name || '—'}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
