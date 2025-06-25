import React, { useState, useEffect } from 'react';

const Admin = ({ 
  currentUser, 
  applications = [], // Default to empty array
  photoReviews = [], // Default to empty array
  onApproveApplication, 
  onRejectApplication, 
  onApprovePhoto, 
  onRejectPhoto 
}) => {
  const [adminSection, setAdminSection] = useState('applications');

  // Debug effect to log applications data
  useEffect(() => {
    console.log('Admin component received applications:', applications);
    console.log('Applications length:', applications.length);
    console.log('Applications data structure:', applications[0]);
  }, [applications]);

  // Only render if user is admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="page">
        <div className="text-center">
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const showAdminSection = (section) => {
    setAdminSection(section);
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    try {
      // Handle both Date objects and ISO strings
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error, 'Date value:', date);
      return 'Invalid Date';
    }
  };

  // Helper function to safely parse images
  const parseImages = (images) => {
    if (!images) return [];
    
    // If it's already an array, return it
    if (Array.isArray(images)) return images;
    
    // If it's a string, try to parse it as JSON
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Error parsing images JSON:', error);
        return [];
      }
    }
    
    return [];
  };

  // Safe filtering with proper checks
  const pendingApplications = applications.filter(app => {
    console.log('Filtering app:', app, 'Status:', app?.status); // Debug log
    return app && app.status === 'pending';
  });
  
  const pendingPhotoReviews = photoReviews.filter(photo => photo && photo.status === 'pending');
  
  const pendingApplicationsCount = pendingApplications.length;
  const pendingPhotoReviewsCount = pendingPhotoReviews.length;

  console.log('Pending applications count:', pendingApplicationsCount); // Debug log
  console.log('Pending applications:', pendingApplications); // Debug log

  return (
    <div className="page">
      <div className="admin-nav">
        <div className="container">
          <div className="admin-nav-links">
            <a 
              href="#" 
              className={`admin-nav-link ${adminSection === 'applications' ? 'active' : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                showAdminSection('applications');
              }}
            >
              Applications
              {pendingApplicationsCount > 0 && (
                <span className="badge">{pendingApplicationsCount}</span>
              )}
            </a>

            <a 
              href="#" 
              className={`admin-nav-link ${adminSection === 'photos' ? 'active' : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                showAdminSection('photos');
              }}
            >
              Photo Reviews
              {pendingPhotoReviewsCount > 0 && (
                <span className="badge">{pendingPhotoReviewsCount}</span>
              )}
            </a>
            
            <a 
              href="#" 
              className={`admin-nav-link ${adminSection === 'users' ? 'active' : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                showAdminSection('users');
              }}
            >
              User Management
            </a>
            
            <a 
              href="#" 
              className={`admin-nav-link ${adminSection === 'reports' ? 'active' : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                showAdminSection('reports');
              }}
            >
              Reports
            </a>
          </div>
        </div>
      </div>

      <div className="admin-content">
        {/* Applications Section */}
        {adminSection === 'applications' && (
          <div className="admin-section">
            <h2 className="mb-2">Photographer Applications</h2>
            
            <div id="applications-list">
              {pendingApplications.length === 0 ? (
                <div className="admin-card">
                  <p>No pending applications at the moment.</p>
                  {applications.length > 0 && (
                    <p><em>Total applications in system: {applications.length}</em></p>
                  )}
                </div>
              ) : (
                pendingApplications.map(app => {
                  const appImages = parseImages(app.images);
                  
                  return (
                    <div key={app.id} className="admin-card">
                      <div className="flex justify-between items-start">
                        <div style={{ flex: 1 }}>
                          <h3>{app.name || 'Unknown Name'}</h3>
                          <p><strong>Email:</strong> {app.email || 'No email provided'}</p>
                          <p><strong>Experience:</strong> {app.experience || 'Not specified'} years</p>
                          <p><strong>Specialization:</strong> {app.specialization || 'Not specified'}</p>
                          <p><strong>Portfolio:</strong> 
                            {app.portfolio ? (
                              <a href={app.portfolio} target="_blank" rel="noopener noreferrer">
                                {app.portfolio}
                              </a>
                            ) : (
                              'No portfolio provided'
                            )}
                          </p>
                          <p><strong>Bio:</strong> {app.bio || 'No bio provided'}</p>
                          <p><strong>Submitted:</strong> {formatDate(app.submittedAt)}</p>
                          <p><strong>Status:</strong> <span className="status-badge pending">{app.status}</span></p>
                          
                          {/* Application Images Section */}
                          {appImages.length > 0 && (
                            <div className="mt-2">
                              <p><strong>Submitted Images ({appImages.length}):</strong></p>
                              <div className="flex gap-1 mt-1" style={{ flexWrap: 'wrap' }}>
                                {appImages.map((imageUrl, index) => (
                                  <div key={index} className="image-preview">
                                    <img 
                                      src={imageUrl} 
                                      alt={`Application image ${index + 1}`}
                                      style={{ 
                                        width: '120px', 
                                        height: '90px', 
                                        objectFit: 'cover', 
                                        borderRadius: '6px',
                                        border: '1px solid #ddd',
                                        cursor: 'pointer'
                                      }}
                                      onClick={() => window.open(imageUrl, '_blank')}
                                      title="Click to view full size"
                                      onError={(e) => {
                                        console.error('Image failed to load:', imageUrl);
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Debug info for images */}
                          {/* {process.env.NODE_ENV === 'development' && (
                            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '12px' }}>
                              <strong>Debug Info:</strong><br/>
                              Raw images data: {JSON.stringify(app.images)}<br/>
                              Parsed images: {JSON.stringify(appImages)}<br/>
                              Images count: {appImages.length}
                            </div>
                          )} */}
                        </div>
                        <div className="flex gap-1" style={{ marginLeft: '1rem' }}>
                          <button 
                            className="btn btn-primary"
                            onClick={() => onApproveApplication(app.id)}
                            disabled={!onApproveApplication}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-secondary"
                            onClick={() => onRejectApplication(app.id)}
                            disabled={!onRejectApplication}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Show all applications section */}
            {applications.length > pendingApplications.length && (
              <div className="mt-2">
                <h3>All Applications ({applications.length})</h3>
                <div className="admin-card">
                  <p>
                    Pending: {pendingApplicationsCount} | 
                    Approved: {applications.filter(app => app && app.status === 'approved').length} | 
                    Rejected: {applications.filter(app => app && app.status === 'rejected').length}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Photo Reviews Section */}
        {adminSection === 'photos' && (
          <div className="admin-section">
            <h2 className="mb-2">Photo Review Queue</h2>
            <div id="photo-reviews-list">
              {pendingPhotoReviews.length === 0 ? (
                <div className="admin-card">
                  <p>No photos pending review at the moment.</p>
                </div>
              ) : (
                pendingPhotoReviews.map(photo => (
                  <div key={photo.id} className="admin-card">
                    <div className="flex gap-2">
                      <img 
                        src={photo.url} 
                        alt={photo.caption || 'Photo'}
                        style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3>Photo Review</h3>
                        <p><strong>Caption:</strong> {photo.caption || 'No caption'}</p>
                        <p><strong>Photographer ID:</strong> {photo.photographerId || 'Unknown'}</p>
                        <p><strong>Submitted:</strong> {formatDate(photo.submittedAt)}</p>
                        <p><strong>Status:</strong> <span className="status-badge pending">{photo.status}</span></p>
                        <div className="flex gap-1 mt-2">
                          <button 
                            className="btn btn-primary"
                            onClick={() => onApprovePhoto(photo.id)}
                            disabled={!onApprovePhoto}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-secondary"
                            onClick={() => onRejectPhoto(photo.id)}
                            disabled={!onRejectPhoto}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* User Management Section */}
        {adminSection === 'users' && (
          <div className="admin-section">
            <h2 className="mb-2">User Management</h2>
            <div id="users-list">
              <div className="admin-card">
                <h3>User Management Tools</h3>
                <p>User management features will be implemented here.</p>
                <div className="flex gap-1">
                  <button className="btn btn-secondary">View All Users</button>
                  <button className="btn btn-secondary">View Photographers</button>
                  <button className="btn btn-secondary">Manage Permissions</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Section */}
        {adminSection === 'reports' && (
          <div className="admin-section">
            <h2 className="mb-2">Platform Statistics</h2>
            <div className="flex gap-1 mb-2">
              <div className="admin-card" style={{ flex: 1, textAlign: 'center' }}>
                <h3>Total Users</h3>
                <div className="stat-number">1,234</div>
              </div>
              <div className="admin-card" style={{ flex: 1, textAlign: 'center' }}>
                <h3>Verified Photographers</h3>
                <div className="stat-number">156</div>
              </div>
              <div className="admin-card" style={{ flex: 1, textAlign: 'center' }}>
                <h3>Total Photos</h3>
                <div className="stat-number">5,678</div>
              </div>
            </div>
            
            <div className="admin-card">
              <h3>Recent Activity</h3>
              <div className="mb-2">
                <h4>Pending Applications: {pendingApplicationsCount}</h4>
                <h4>Photos Awaiting Review: {pendingPhotoReviewsCount}</h4>
                <h4>Total Applications: {applications.length}</h4>
              </div>
            </div>

            <div className="admin-card">
              <h3>System Health</h3>
              <div className="flex gap-1">
                <div style={{ flex: 1 }}>
                  <h4>Server Status</h4>
                  <span className="availability-badge available">Online</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4>Database Status</h4>
                  <span className="availability-badge available">Connected</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4>Storage</h4>
                  <span className="availability-badge available">75% Used</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;