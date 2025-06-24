import React, { useState } from 'react';

const Admin = ({ 
  currentUser, 
  applications, 
  photoReviews, 
  onApproveApplication, 
  onRejectApplication, 
  onApprovePhoto, 
  onRejectPhoto 
}) => {
  const [adminSection, setAdminSection] = useState('applications');

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
    return new Date(date).toLocaleDateString();
  };
  const pendingApplicationsCount = applications?.filter(app => app.status === 'pending').length || 0;
// const pendingPhotoReviewsCount = photoReviews?.filter(photo => photo.status === 'pending').length || 0;



  return (
    <div className="page">
      <div className="admin-nav">
        <div className="container">
          <div className="admin-nav-links">
           <a 
  href="#" 
  className={`admin-nav-link ${adminSection === 'applications' ? 'active' : ''}`} 
  onClick={() => showAdminSection('applications')}
>
  Applications
  {pendingApplicationsCount > 0 && (
    <span className="badge">{pendingApplicationsCount}</span>
  )}
</a>


            <a 
              href="#" 
              className={`admin-nav-link ${adminSection === 'photos' ? 'active' : ''}`} 
              onClick={() => showAdminSection('photos')}
            >
              Photo Reviews
            </a>
            <a 
              href="#" 
              className={`admin-nav-link ${adminSection === 'users' ? 'active' : ''}`} 
              onClick={() => showAdminSection('users')}
            >
              User Management
            </a>
            <a 
              href="#" 
              className={`admin-nav-link ${adminSection === 'reports' ? 'active' : ''}`} 
              onClick={() => showAdminSection('reports')}
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
              {applications.filter(app => app.status === 'pending').length === 0 ? (
                <div className="admin-card">
                  <p>No pending applications at the moment.</p>
                </div>
              ) : (
                applications.filter(app => app.status === 'pending').map(app => (
                  <div key={app.id} className="admin-card">
                    <div className="flex justify-between items-start">
                      <div style={{ flex: 1 }}>
                        <h3>{app.name}</h3>
                        <p><strong>Email:</strong> {app.email}</p>
                        <p><strong>Experience:</strong> {app.experience} years</p>
                        <p><strong>Specialization:</strong> {app.specialization}</p>
                        <p><strong>Portfolio:</strong> 
                          <a href={app.portfolio} target="_blank" rel="noopener noreferrer">
                            {app.portfolio}
                          </a>
                        </p>
                        <p><strong>Bio:</strong> {app.bio}</p>
                        <p><strong>Submitted:</strong> {formatDate(app.submittedAt)}</p>
                      </div>
                      <div className="flex gap-1" style={{ marginLeft: '1rem' }}>
                        <button 
                          className="btn btn-primary"
                          onClick={() => onApproveApplication(app.id)}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => onRejectApplication(app.id)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Photo Reviews Section */}
        {adminSection === 'photos' && (
          <div className="admin-section">
            <h2 className="mb-2">Photo Review Queue</h2>
            <div id="photo-reviews-list">
              {photoReviews.filter(photo => photo.status === 'pending').length === 0 ? (
                <div className="admin-card">
                  <p>No photos pending review at the moment.</p>
                </div>
              ) : (
                photoReviews.filter(photo => photo.status === 'pending').map(photo => (
                  <div key={photo.id} className="admin-card">
                    <div className="flex gap-2">
                      <img 
                        src={photo.url} 
                        alt={photo.caption}
                        style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3>Photo Review</h3>
                        <p><strong>Caption:</strong> {photo.caption}</p>
                        <p><strong>Photographer ID:</strong> {photo.photographerId}</p>
                        <p><strong>Submitted:</strong> {formatDate(photo.submittedAt)}</p>
                        <div className="flex gap-1 mt-2">
                          <button 
                            className="btn btn-primary"
                            onClick={() => onApprovePhoto(photo.id)}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-secondary"
                            onClick={() => onRejectPhoto(photo.id)}
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
                <h4>Pending Applications: {applications.filter(app => app.status === 'pending').length}</h4>
                <h4>Photos Awaiting Review: {photoReviews.filter(photo => photo.status === 'pending').length}</h4>
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