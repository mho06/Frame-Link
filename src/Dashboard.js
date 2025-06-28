import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ 
    currentUser, 
    onPhotoUpload, 
    onProfileUpdate, 
    isUpdatingProfile,
    userPhotos = [], // Add user's photos (approved, pending, rejected)
    photoStats = { pending: 0, approved: 0, rejected: 0 } // Add photo statistics
}) => {
  const navigate = useNavigate();
  
  // State for forms
  const [activeTab, setActiveTab] = useState('overview');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  // Profile update state
  const [bio, setBio] = useState('');
  const [availability, setAvailability] = useState('available');
  const [avatarFile, setAvatarFile] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  // Redirect if not photographer
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (currentUser.role !== 'photographer' && currentUser.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [currentUser, navigate]);

  // Initialize profile data
  useEffect(() => {
    if (currentUser) {
      setBio(currentUser.bio || '');
      setAvailability(currentUser.availability || 'available');
    }
  }, [currentUser]);




  
  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setRemoveAvatar(false);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle photo upload
  const handlePhotoSubmit = async (e) => {
  e.preventDefault();
  
  if (!photoCaption.trim()) {
    alert('Please add a caption for your photo');
    return;
  }
  
  if (!photoFile) {
    alert('Please select a photo to upload');
    return;
  }

  setIsUploadingPhoto(true);
  try {
    await onPhotoUpload(photoCaption, photoFile);
    setPhotoCaption('');
    setPhotoFile(null);
    
    // Reset file input
    const fileInput = document.getElementById('photo-file');
    if (fileInput) fileInput.value = '';
    
    // Show success message about review process
    alert('Photo uploaded successfully! It will appear in the gallery after admin review.');
    
    // IMPORTANT: Trigger a data refresh in the parent component
    // This should be handled by the parent component updating userPhotos and photoStats
    
  } catch (error) {
    console.error('Error uploading photo:', error);
    alert('Failed to upload photo. Please try again.');
  } finally {
    setIsUploadingPhoto(false);
  }
};

const renderOverviewTab = () => (
  <div className="dashboard-section">
    <h2>Dashboard Overview</h2>
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Photos Uploaded</h3>
        <div className="stat-number">{userPhotos.length}</div> {/* This was hardcoded as 0 */}
        <p>Total photos submitted</p>
      </div>
      <div className="stat-card">
        <h3>Approved Photos</h3>
        <div className="stat-number" style={{ color: '#10b981' }}>{photoStats.approved}</div>
        <p>Live in gallery</p>
      </div>
      <div className="stat-card">
        <h3>Pending Review</h3>
        <div className="stat-number" style={{ color: '#f59e0b' }}>{photoStats.pending}</div>
        <p>Awaiting admin approval</p>
      </div>
      <div className="stat-card">
        <h3>Status</h3>
        <div className="stat-status">{availability || 'Available'}</div>
        <p>Current availability</p>
      </div>
    </div>
    {/* Rest of your overview content... */}
  </div>
);

const renderUploadTab = () => (
  <div className="dashboard-section">
    <h2>Upload New Photo</h2>
    
    {photoStats.pending > 0 && (
      <div className="review-notice">
        <h4>📋 Review Status</h4>
        <p>You have <strong>{photoStats.pending}</strong> photo(s) pending admin review.</p>
      </div>
    )}

    <form onSubmit={handlePhotoSubmit} className="upload-form">
      <div className="form-group">
        <label htmlFor="photo-file">Select Photo:</label>
        <input
          type="file"
          id="photo-file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files[0])}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="photo-caption">Caption:</label>
        <textarea
          id="photo-caption"
          value={photoCaption}
          onChange={(e) => setPhotoCaption(e.target.value)}
          placeholder="Write a caption for your photo..."
          rows="3"
          required
        />
      </div>

      <button 
        type="submit" 
        className="submit-btn"
        disabled={isUploadingPhoto}
      >
        {isUploadingPhoto ? 'Uploading...' : 'Upload Photo'}
      </button>
    </form>

    <div className="upload-info">
      <h3>📋 Review Process</h3>
      <div className="review-process">
        <div className="process-step">
          <span className="step-number">1</span>
          <div>
            <h4>Upload</h4>
            <p>Submit your photo with a caption</p>
          </div>
        </div>
        <div className="process-step">
          <span className="step-number">2</span>
          <div>
            <h4>Review</h4>
            <p>Admin reviews for quality and guidelines</p>
          </div>
        </div>
        <div className="process-step">
          <span className="step-number">3</span>
          <div>
            <h4>Publish</h4>
            <p>Approved photos appear in the gallery</p>
          </div>
        </div>
      </div>
      
      <h4>Upload Guidelines</h4>
      <ul>
        <li>Photos will be reviewed before appearing in the gallery</li>
        <li>Ensure your photos are high quality and professional</li>
        <li>Add descriptive captions to help viewers understand your work</li>
        <li>Supported formats: JPG, PNG, WebP</li>
        <li>Review typically takes 24-48 hours</li>
      </ul>
    </div>
  </div>
);

// 5. Add these CSS styles to your existing style block:
const additionalStyles = `
  .photo-status-overview {
    margin: 2rem 0;
  }

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .photo-preview-card {
    background: #f8fafc;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
  }

  .photo-thumbnail {
    width: 100%;
    height: 120px;
    object-fit: cover;
  }

  .photo-info {
    padding: 0.75rem;
  }

  .photo-caption {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  .status-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: 500;
    text-transform: capitalize;
  }

  .status-badge.pending {
    background: #fef3c7;
    color: #92400e;
  }

  .status-badge.approved {
    background: #d1fae5;
    color: #065f46;
  }

  .status-badge.rejected {
    background: #fee2e2;
    color: #991b1b;
  }

  .rejection-reason {
    font-size: 0.8rem;
    color: #dc2626;
    margin-top: 0.5rem;
    font-style: italic;
  }

  .review-notice {
    background: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .review-notice h4 {
    color: #92400e;
    margin-bottom: 0.5rem;
  }

  .review-process {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
    flex-wrap: wrap;
  }

  .process-step {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 200px;
  }

  .step-number {
    background: #667eea;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .process-step h4 {
    margin-bottom: 0.25rem;
    color: #374151;
  }

  .process-step p {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0;
  }
`;
  // Handle profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await onProfileUpdate(bio, availability, avatarFile, removeAvatar);
      setAvatarFile(null);
      setAvatarPreview('');
      setRemoveAvatar(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Remove avatar
  const handleRemoveAvatar = () => {
    setRemoveAvatar(true);
    setAvatarFile(null);
    setAvatarPreview('');
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  if (currentUser.role !== 'photographer' && currentUser.role !== 'admin') {
    return <div>Access denied. This page is for photographers only.</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Photographer Dashboard</h1>
        <p>Welcome back, {currentUser.name}!</p>
      </div>

      {/* Dashboard Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload Photo
        </button>
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Edit Profile
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && renderOverviewTab()}

        {/* Upload Photo Tab */}
        {activeTab === 'upload' && renderUploadTab()}

        {/* Edit Profile Tab */}
        {activeTab === 'profile' && (
          <div className="dashboard-section">
            <h2>Edit Profile</h2>
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group">
                <label>Current Avatar:</label>
                <div className="avatar-section">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" className="avatar-preview" />
                  ) : (
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=667eea&color=fff&size=80`} 
                      alt="Current avatar" 
                      className="avatar-preview" 
                    />
                  )}
                  <div className="avatar-controls">
                    <input
                      type="file"
                      id="avatar-file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="avatar-file" className="btn-secondary">
                      Change Avatar
                    </label>
                    <button 
                      type="button" 
                      onClick={handleRemoveAvatar}
                      className="btn-danger"
                    >
                      Remove Avatar
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="profile-bio">Bio:</label>
                <textarea
                  id="profile-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell potential clients about yourself and your photography style..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-availability">Availability:</label>
                <select
                  id="profile-availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          color: #333;
          margin-bottom: 0.5rem;
        }

        .dashboard-tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .tab-button {
          padding: 1rem 2rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: #6b7280;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .tab-button:hover {
          color: #667eea;
        }

        .tab-button.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }

        .dashboard-content {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .dashboard-section h2 {
          color: #333;
          margin-bottom: 1.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
        }

        .stat-card h3 {
          color: #6b7280;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 0.5rem;
        }

        .stat-status {
          font-size: 1.2rem;
          font-weight: bold;
          color: #10b981;
          margin-bottom: 0.5rem;
          text-transform: capitalize;
        }

        .recent-activity {
          margin-top: 2rem;
        }

        .activity-list {
          background: #f8fafc;
          border-radius: 8px;
          padding: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0;
        }

        .activity-icon {
          font-size: 1.2rem;
        }

        .activity-time {
          margin-left: auto;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 1rem;
        }

        .form-group textarea {
          resize: vertical;
        }

        .submit-btn {
          background: #667eea;
          color: white;
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-btn:hover {
          background: #5a67d8;
        }

        .submit-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .avatar-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .avatar-preview {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-controls {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .btn-secondary {
          background: #6b7280;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }

        .btn-danger {
          background: #dc2626;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .upload-info {
          margin-top: 2rem;
          padding: 1.5rem;
          background: #f0f9ff;
          border-radius: 8px;
          border-left: 4px solid #0ea5e9;
        }

        .upload-info h3 {
          color: #0c4a6e;
          margin-bottom: 1rem;
        }

        .upload-info ul {
          color: #0c4a6e;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .dashboard {
            padding: 1rem;
          }

          .dashboard-tabs {
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .avatar-section {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;