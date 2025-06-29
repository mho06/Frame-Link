import React, { useState, useEffect, useMemo } from 'react';

const Admin = ({ 
  currentUser, 
  applications = [],
  photoReviews = [],
  approvedPhotos = [],
  users = [],
  onApproveApplication, 
  onRejectApplication, 
  onApprovePhoto, 
  onRejectPhoto,
  onUpdateUserRole,
  onDeactivateUser
}) => {
  const [adminSection, setAdminSection] = useState('applications');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate statistics
  const statistics = useMemo(() => {
    const safeApplications = Array.isArray(applications) ? applications : [];
    const safePhotoReviews = Array.isArray(photoReviews) ? photoReviews : [];
    const safeApprovedPhotos = Array.isArray(approvedPhotos) ? approvedPhotos : [];
    const safeUsers = Array.isArray(users) ? users : [];

    return {
      totalUsers: safeUsers.length,
      photographers: safeUsers.filter(user => 
        user && 
        (user.role === 'photographer' || user.role === 'Photographer' || user.role === 'PHOTOGRAPHER') && 
        user.status !== 'deactivated'
      ).length,
      regularUsers: safeUsers.filter(user => 
        user && 
        (user.role === 'user' || user.role === 'User' || user.role === 'USER' || !user.role) && 
        user.status !== 'deactivated'
      ).length,
      deactivatedUsers: safeUsers.filter(user => 
        user && (user.status === 'deactivated' || user.status === 'inactive')
      ).length,
      
      pendingApplications: safeApplications.filter(app => 
        app && typeof app === 'object' && app.status === 'pending'
      ),
      approvedApplications: safeApplications.filter(app => 
        app && typeof app === 'object' && app.status === 'approved'
      ).length,
      rejectedApplications: safeApplications.filter(app => 
        app && typeof app === 'object' && app.status === 'rejected'
      ).length,
      
      pendingPhotoReviews: safePhotoReviews.filter(photo => 
        photo && typeof photo === 'object' && photo.status === 'pending'
      ),
      approvedPhotosCount: safeApprovedPhotos.length,
      rejectedPhotos: safePhotoReviews.filter(photo => 
        photo && typeof photo === 'object' && photo.status === 'rejected'
      ).length,
      totalPhotosInSystem: safeApprovedPhotos.length + safePhotoReviews.length
    };
  }, [applications, photoReviews, approvedPhotos, users]);

  // Utility functions
  const formatDate = (date) => {
    if (!date) return 'Unknown';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const parseImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        return [];
      }
    }
    
    return [];
  };

  const getPhotographerName = (photographerId) => {
    if (!Array.isArray(users) || !photographerId) return 'Unknown Photographer';
    const photographer = users.find(user => user?.id === photographerId);
    return photographer?.full_name || 'Unknown Photographer';
  };

  const getWeeklyStats = (items, dateField) => {
    if (!Array.isArray(items)) return 0;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return items.filter(item => {
      if (!item?.[dateField]) return false;
      return new Date(item[dateField]) > weekAgo;
    }).length;
  };

  // Authorization check
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

  if (isLoading) {
    return (
      <div className="page">
        <div className="text-center">
          <h2>Loading Admin Panel...</h2>
        </div>
      </div>
    );
  }

  // Render section components
  const renderApplications = () => (
    <div className="admin-section">
      <h2 className="mb-2">Photographer Applications</h2>
      
      <div id="applications-list">
        {statistics.pendingApplications.length === 0 ? (
          <div className="admin-card">
            <p>No pending applications at the moment.</p>
            {Array.isArray(applications) && applications.length > 0 && (
              <p><em>Total applications in system: {applications.length}</em></p>
            )}
          </div>
        ) : (
          statistics.pendingApplications.map(app => {
            const appImages = parseImages(app.images);
            
            return (
              <div key={app.id} className="admin-card">
                <div>
                  <div style={{ flex: 1 }}>
                    <h3>{app.full_name || 'Unknown Name'}</h3>
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
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
      
      {Array.isArray(applications) && applications.length > statistics.pendingApplications.length && (
        <div className="mt-2">
          <h3>All Applications ({applications.length})</h3>
          <div className="admin-card">
            <p>
              Pending: {statistics.pendingApplications.length} | 
              Approved: {statistics.approvedApplications} | 
              Rejected: {statistics.rejectedApplications}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderPhotoReview = (photo) => (
    <div key={photo.id} className="admin-card">
      <div className="flex gap-2">
        <img 
          src={photo.url} 
          alt={photo.caption || 'Photo'}
          style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer'}}
          onClick={() => window.open(photo.url, '_blank')}
        />
        <div style={{ flex: 1 }}>
          <h3>Photo Review</h3>
          <p><strong>Caption:</strong> {photo.caption || 'No caption'}</p>
          <p><strong>Photographer:</strong> {getPhotographerName(photo.photographerId)}</p>
          <p><strong>Submitted:</strong> {formatDate(photo.submittedAt)}</p>
          <p><strong>Status:</strong> <span className="status-badge pending">{photo.status}</span></p>
          {photo.rejectionReason && (
            <p><strong>Rejection Reason:</strong> <em>{photo.rejectionReason}</em></p>
          )}
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
  );

  const renderPhotoReviews = () => (
    <div className="admin-section">
      <h2 className="mb-2">Photo Review Queue</h2>
      <div id="photo-reviews-list">
        {statistics.pendingPhotoReviews.length === 0 ? (
          <div className="admin-card">
            <p>No photos pending review at the moment.</p>
          </div>
        ) : (
          statistics.pendingPhotoReviews.map(photo => renderPhotoReview(photo))
        )}
      </div>
    </div>
  );

  const renderApprovedPhotos = () => {
    const safeApprovedPhotos = Array.isArray(approvedPhotos) ? approvedPhotos : [];
    
    return (
      <div className="admin-section">
        <h2 className="mb-2">Approved Photos ({statistics.approvedPhotosCount})</h2>
        <div className="mb-2">
          <p>These photos are currently live on the platform and visible to users.</p>
        </div>
        
        {safeApprovedPhotos.length === 0 ? (
          <div className="admin-card">
            <p>No approved photos yet.</p>
          </div>
        ) : (
          <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {safeApprovedPhotos.map(photo => (
              <div key={photo.id} className="admin-card">
                <img 
                  src={photo.url} 
                  alt={photo.caption || 'Approved photo'}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                  onClick={() => window.open(photo.url, '_blank')}
                />
                <h4>{photo.caption || 'No caption'}</h4>
                <p><strong>Photographer:</strong> {getPhotographerName(photo.photographerId)}</p>
                <p><strong>Approved:</strong> {formatDate(photo.approvedAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderUserManagement = () => {
    const safeUsers = Array.isArray(users) ? users : [];
    const activeUsers = safeUsers.filter(user => user?.status !== 'deactivated');

    return (
      <div className="admin-section">
        <h2 className="mb-2">User Management</h2>
        
        <div className="flex gap-1 mb-2">
          <div className="admin-card" style={{ flex: 1, textAlign: 'center' }}>
            <h4>Total Users</h4>
            <div className="stat-number">{statistics.totalUsers}</div>
            <small>{statistics.deactivatedUsers} deactivated</small>
          </div>
          <div className="admin-card" style={{ flex: 1, textAlign: 'center' }}>
            <h4>Active Photographers</h4>
            <div className="stat-number">{statistics.photographers}</div>
            <small>Currently active</small>
          </div>
          <div className="admin-card" style={{ flex: 1, textAlign: 'center' }}>
            <h4>Regular Users</h4>
            <div className="stat-number">{statistics.regularUsers}</div>
            <small>Active users</small>
          </div>
        </div>

        <div className="admin-card">
          <h3>Recent Users</h3>
          {activeUsers.length === 0 ? (
            <p>No active users found.</p>
          ) : (
            activeUsers.slice(0, 10).map(user => (
              <div key={user.id} className="flex justify-between items-center" style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                <div>
                  <strong>{user.full_name || 'No name'}</strong> ({user.email || 'No email'})
                  <br />
                  <span className="status-badge">{user.role || 'user'}</span>
                  <span style={{ marginLeft: '10px', color: '#666' }}>
                    Joined: {formatDate(user.createdAt)}
                  </span>
                </div>
                <div className="flex gap-1">
                  {user.role === 'user' && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => onUpdateUserRole && onUpdateUserRole(user.id, 'photographer')}
                      style={{ fontSize: '12px', padding: '5px 10px' }}
                    >
                      Make Photographer
                    </button>
                  )}
                  <button 
                    className="btn btn-secondary"
                    onClick={() => onDeactivateUser && onDeactivateUser(user.id)}
                    style={{ fontSize: '12px', padding: '5px 10px' }}
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderReports = () => {
    const safeApplications = Array.isArray(applications) ? applications : [];
    const safePhotoReviews = Array.isArray(photoReviews) ? photoReviews : [];

    return (
      <div className="admin-section">
        <h2 className="mb-2">Platform Statistics & Reports</h2>
        
        <div className="flex gap-1 mb-2">
          <div className="admin-card" style={{ flex: 1, textAlign: 'center' }}>
            <h3>Total Users</h3>
            <div className="stat-number">{statistics.totalUsers}</div>
            <small>{statistics.deactivatedUsers} deactivated</small>
          </div>
          <div className="admin-card" style={{ flex: 1, textAlign: 'center' }}>
            <h3>Active Photographers</h3>
            <div className="stat-number">{statistics.photographers}</div>
            <small>Currently active</small>
          </div>
          <div className="admin-card" style={{ flex: 1, textAlign: 'center' }}>
            <h3>Approved Photos</h3>
            <div className="stat-number">{statistics.approvedPhotosCount}</div>
            <small>Live on platform</small>
          </div>
          <div className="admin-card" style={{ flex: 1, textAlign: 'center' }}>
            <h3>Total Photos</h3>
            <div className="stat-number">{statistics.totalPhotosInSystem}</div>
            <small>Including pending</small>
          </div>
        </div>
        
        <div className="admin-card mb-2">
          <h3>Application Statistics</h3>
          <div className="flex gap-2" style={{ justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <h4>Total Applications</h4>
              <div className="stat-number">{safeApplications.length}</div>
            </div>
            <div>
              <h4>Pending</h4>
              <div className="stat-number" style={{ color: '#f59e0b' }}>{statistics.pendingApplications.length}</div>
            </div>
            <div>
              <h4>Approved</h4>
              <div className="stat-number" style={{ color: '#10b981' }}>{statistics.approvedApplications}</div>
            </div>
            <div>
              <h4>Rejected</h4>
              <div className="stat-number" style={{ color: '#ef4444' }}>{statistics.rejectedApplications}</div>
            </div>
          </div>
        </div>

        <div className="admin-card mb-2">
          <h3>Photo Review Statistics</h3>
          <div className="flex gap-2" style={{ justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <h4>Approved & Live</h4>
              <div className="stat-number" style={{ color: '#10b981' }}>{statistics.approvedPhotosCount}</div>
            </div>
            <div>
              <h4>Pending Review</h4>
              <div className="stat-number" style={{ color: '#f59e0b' }}>{statistics.pendingPhotoReviews.length}</div>
            </div>
            <div>
              <h4>Rejected</h4>
              <div className="stat-number" style={{ color: '#ef4444' }}>{statistics.rejectedPhotos}</div>
            </div>
            <div>
              <h4>Total in System</h4>
              <div className="stat-number">{statistics.totalPhotosInSystem}</div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3>Recent Activity</h3>
          <div className="mb-2">
            <h4>Urgent Items:</h4>
            <ul style={{ marginLeft: '20px' }}>
              <li>Applications awaiting review: <strong>{statistics.pendingApplications.length}</strong></li>
              <li>Photos awaiting review: <strong>{statistics.pendingPhotoReviews.length}</strong></li>
            </ul>
          </div>
          
          <div className="mb-2">
            <h4>This Week:</h4>
            <ul style={{ marginLeft: '20px' }}>
              <li>New applications: {getWeeklyStats(safeApplications, 'submittedAt')}</li>
              <li>Photos submitted: {getWeeklyStats(safePhotoReviews, 'submittedAt')}</li>
            </ul>
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
              <h4>Photo Storage</h4>
              <span className="availability-badge available">{Math.round((statistics.totalPhotosInSystem / 1000) * 100)}% Used</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const showAdminSection = (section) => {
    setAdminSection(section);
  };

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
              {statistics.pendingApplications.length > 0 && (
                <span className="badge">{statistics.pendingApplications.length}</span>
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
              {statistics.pendingPhotoReviews.length > 0 && (
                <span className="badge">{statistics.pendingPhotoReviews.length}</span>
              )}
            </a>

            <a 
              href="#" 
              className={`admin-nav-link ${adminSection === 'approved-photos' ? 'active' : ''}`} 
              onClick={(e) => {
                e.preventDefault();
                showAdminSection('approved-photos');
              }}
            >
              Approved Photos
              <span className="badge">{statistics.approvedPhotosCount}</span>
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
        {adminSection === 'applications' && renderApplications()}
        {adminSection === 'photos' && renderPhotoReviews()}
        {adminSection === 'approved-photos' && renderApprovedPhotos()}
        {adminSection === 'users' && renderUserManagement()}
        {adminSection === 'reports' && renderReports()}
      </div>
    </div>
  );
};

export default Admin;