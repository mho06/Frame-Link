import React, { useState } from 'react';

const Dashboard = ({ currentUser, onPhotoUpload, onProfileUpdate }) => {
  const [photoCaption, setPhotoCaption] = useState('');
  const [profileData, setProfileData] = useState({
    bio: '',
    availability: 'available'
  });

  // Only render if user is a photographer
  if (!currentUser || currentUser.role !== 'photographer') {
    return (
      <div className="page">
        <div className="text-center">
          <h2>Access Denied</h2>
          <p>You need to be a verified photographer to access this page.</p>
        </div>
      </div>
    );
  }

  const handlePhotoUpload = (e) => {
    e.preventDefault();
    if (photoCaption.trim()) {
      onPhotoUpload(photoCaption);
      setPhotoCaption('');
      e.target.reset();
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    onProfileUpdate(profileData.bio, profileData.availability);
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="page">
      <h2 className="mb-2">Photographer Dashboard</h2>

      {/* Upload New Photo */}
      <div className="admin-card">
        <h3>Upload New Photo</h3>
        <form onSubmit={handlePhotoUpload}>
          <div className="form-group">
            <label htmlFor="photo-file">Select Photo</label>
            <input type="file" id="photo-file" accept="image/*" required />
          </div>
          <div className="form-group">
            <label htmlFor="photo-caption">Caption</label>
            <textarea 
              id="photo-caption" 
              name="caption"
              rows="3" 
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              placeholder="Describe your photo..."
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Upload Photo</button>
        </form>
      </div>

      {/* Profile Management */}
      <div className="admin-card">
        <h3>Profile Management</h3>
        <form onSubmit={handleProfileUpdate}>
          <div className="form-group">
            <label htmlFor="profile-photo">Profile Photo</label>
            <input type="file" id="profile-photo" accept="image/*" />
          </div>
          <div className="form-group">
            <label htmlFor="profile-bio-edit">Bio</label>
            <textarea 
              id="profile-bio-edit" 
              name="bio"
              rows="4" 
              value={profileData.bio}
              onChange={handleProfileInputChange}
              placeholder="Tell your story..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="profile-availability">Availability</label>
            <select 
              id="profile-availability"
              name="availability"
              value={profileData.availability}
              onChange={handleProfileInputChange}
            >
              <option value="available">Available for bookings</option>
              <option value="busy">Currently busy</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="profile-instagram">Social Media Links</label>
            <input 
              type="url" 
              id="profile-instagram" 
              placeholder="Instagram URL" 
              className="mb-2" 
            />
            <input 
              type="url" 
              id="profile-website" 
              placeholder="Website URL" 
            />
          </div>
          <button type="submit" className="btn btn-primary">Update Profile</button>
        </form>
      </div>

      {/* Statistics Dashboard */}
      <div className="admin-card">
        <h3>Your Statistics</h3>
        <div className="flex gap-1 mb-2">
          <div className="admin-card" style={{ flex: 1, textAlign: 'center' }}>
            <h4>Photos Uploaded</h4>
            <div className="stat-number">0</div>
          </div>
          <div className="admin-card" style={{ flex: 1, textAlign: 'center' }}>
            <h4>Total Views</h4>
            <div className="stat-number">0</div>
          </div>
          <div className="admin-card" style={{ flex: 1, textAlign: 'center' }}>
            <h4>Total Likes</h4>
            <div className="stat-number">0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;