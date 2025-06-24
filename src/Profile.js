import React from 'react';

const Profile = ({ photographer, photos, onContactPhotographer }) => {
  if (!photographer) {
    return (
      <div className="page">
        <div className="text-center">
          <h2>Photographer not found</h2>
          <p>Please select a photographer from the directory.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="profile-header">
        <img src={photographer.avatar} alt="Profile" className="profile-avatar" />
        <h1 className="profile-name">{photographer.name}</h1>
        <div className="verified-badge">Verified Photographer</div>
        <p className="profile-bio">{photographer.bio}</p>
        <div className="profile-stats">
          <div className="stat">
            <div className="stat-number">{photographer.photoCount}</div>
            <div className="stat-label">Photos</div>
          </div>
          <div className="stat">
            <div className="stat-number">{photographer.followers}</div>
            <div className="stat-label">Followers</div>
          </div>
          <div className="stat">
            <div className="stat-number">{photographer.specialization}</div>
            <div className="stat-label">Specialty</div>
          </div>
        </div>
        <div className="mt-2">
          <button className="btn btn-primary" onClick={() => onContactPhotographer(photographer.id)}>Contact Photographer</button>
        </div>
      </div>

      <div className="photo-grid">
        {photos.filter(photo => photo.photographerId === photographer.id && photo.approved).map((photo, index) => (
          <div className="photo-card" key={index}>
            <img src={photo.url} alt={photo.caption} />
            <div className="photo-info">
              <h3>{photo.caption}</h3>
              <div className="photo-stats">
                <span>{photo.likes} likes</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;