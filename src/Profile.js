import React, { useState } from 'react';

const Profile = ({ photographer, photos, onContactPhotographer, currentUser, isOwnProfile, onProfileUpdate }) => {
  const [avatarPreview, setAvatarPreview] = useState(photographer?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    availability: 'available'
  });

  if (!photographer) {
    return (
      <div className="page">
        <div className="text-center">
          <h2>Profile not found</h2>
          <p>Please select a photographer from the directory or login to view your profile.</p>
        </div>
      </div>
    );
  }

  const photographerPhotos = photos.filter(photo =>
    photo.photographerId === photographer.id && photo.approved
  );

  const getRoleInfo = (role) => {
    switch (role) {
      case 'admin':
        return { text: 'Administrator', color: '#dc2626', bgColor: '#fef2f2' };
      case 'photographer':
        return { text: 'Verified Photographer', color: '#059669', bgColor: '#f0fdf4' };
      default:
        return { text: 'Platform Member', color: '#6b7280', bgColor: '#f9fafb' };
    }
  };

  const roleInfo = getRoleInfo(photographer.role);

  
  const handleSaveProfile = () => {
    if (onProfileUpdate) {
      // Pass all necessary data including the avatar file and removal flag
      onProfileUpdate(editForm.bio, editForm.availability, avatarFile, avatarPreview === '');
    }
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setEditForm({
      bio: photographer.bio || '',
      availability: photographer.availability || 'available'
    });
    setAvatarPreview(photographer.avatar || '');
    setAvatarFile(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ bio: '', availability: 'available' });
    setAvatarPreview(photographer.avatar || '');
    setAvatarFile(null);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
  };

  const getAvailabilityBadgeStyle = (availability) => {
    const styles = {
      available: { backgroundColor: '#f0fdf4', color: '#059669', border: '1px solid #059669' },
      busy: { backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #d97706' },
      not_available: { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #dc2626' }
    };
    return styles[availability] || styles.available;
  };

  const getAvailabilityText = (availability) => {
    const texts = {
      available: 'Available',
      busy: 'Busy',
      not_available: 'Not Available'
    };
    return texts[availability] || 'Available';
  };

  return (
    <div className="page">
      <div className="profile-header">
        <div className="profile-avatar-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
          {avatarPreview ? (
            <img src={avatarPreview} alt="Profile" className="profile-avatar" />
          ) : (
            <div className="initials-avatar" style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#ccc',
              color: '#fff',
              fontSize: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {photographer.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
          )}
          {isOwnProfile && isEditing && (
            <>
              <label style={{ position: 'absolute', bottom: 0, right: 0, cursor: 'pointer' }}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
                <span className="change-avatar-button" style={{
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  padding: '4px',
                  fontSize: '14px',
                  border: '1px solid #ccc'
                }}>🖋️</span>
              </label>
              {avatarPreview && (
                <button
                  onClick={handleRemoveAvatar}
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Remove avatar"
                >
                  ✕
                </button>
              )}
            </>
          )}
        </div>

        <h1 className="profile-name">{photographer.name}</h1>

        {/* Role Badge - Always show */}
        <div
          className="verified-badge"
          style={{
            backgroundColor: roleInfo.bgColor,
            color: roleInfo.color,
            border: `1px solid ${roleInfo.color}`,
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}
        >
          {roleInfo.text}
        </div>

        {/* Availability Badge - Show for photographers */}
        {photographer.role === 'photographer' && photographer.availability && photographer.availability !== 'N/A' && (
          <div
            className="availability-badge"
            style={{
              ...getAvailabilityBadgeStyle(photographer.availability),
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px'
            }}
          >
            {getAvailabilityText(photographer.availability)}
          </div>
        )}

        {isEditing ? (
          <div className="mt-2" style={{ width: '100%', maxWidth: '500px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Bio:</label>
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '16px'
              }}
              placeholder="Tell us about yourself..."
            />

            {/* Show availability options for photographers and users who might become photographers */}
            {(photographer.role === 'photographer' || currentUser?.role === 'photographer') && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Availability:</label>
                <select
                  value={editForm.availability}
                  onChange={(e) => setEditForm({ ...editForm, availability: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="not_available">Not Available</option>
                </select>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary" onClick={handleSaveProfile}>Save</button>
              <button className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <p className="profile-bio">{photographer.bio}</p>
            {isOwnProfile && (
              <div className="mt-2 text-center">
                <p><strong>Email:</strong> {photographer.email}</p>
                {photographer.country && <p><strong>Country:</strong> {photographer.country}</p>}
              </div>
            )}
          </>
        )}

        {!isEditing && isOwnProfile && (
          <div className="mt-2">
            <button className="btn btn-secondary" onClick={handleEditClick}>Edit Profile</button>
          </div>
        )}

        {!isOwnProfile && photographer.role === 'photographer' && (
          <div className="mt-2">
            <button
              className="btn btn-primary"
              onClick={() => onContactPhotographer(photographer.id)}
            >
              Contact Photographer
            </button>
          </div>
        )}
      </div>

      {photographerPhotos.length > 0 ? (
        <div>
          <h2 className="section-title">
            {isOwnProfile ? 'My Photos' : `${photographer.name}'s Photos`}
          </h2>
          <div className="photo-grid">
            {photographerPhotos.map((photo, index) => (
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
      ) : (
        <div className="text-center mt-2">
          <h3>{isOwnProfile ? 'No photos uploaded yet' : 'No photos available'}</h3>
          {isOwnProfile && currentUser?.role === 'photographer' && (
            <p>
              <a href="/dashboard" className="btn btn-primary">
                Upload Your First Photo
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;