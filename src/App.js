import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login'; // Make sure Login.js is in the same folder or adjust the path


// Main App Component
const App = () => {
  // Application State
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [photographers, setPhotographers] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [applications, setApplications] = useState([]);
  const [photoReviews, setPhotoReviews] = useState([]);
  const navigate = useNavigate();


  // Form state for login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Initialize sample data
  const initializeData = () => {
    // Sample photographers
    setPhotographers([
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah@example.com",
        country: "US",
        specialization: "Portrait",
        bio: "Award-winning portrait photographer with 8 years of experience",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e2b4a4?w=150&h=150&fit=crop&crop=face",
        availability: "available",
        verified: true,
        photoCount: 45,
        followers: 1250
      },
      {
        id: 2,
        name: "Mike Chen",
        email: "mike@example.com",
        country: "CA",
        specialization: "Landscape",
        bio: "Nature and landscape photographer exploring the wilderness",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        availability: "busy",
        verified: true,
        photoCount: 78,
        followers: 2100
      },
      {
        id: 3,
        name: "Emma Rodriguez",
        email: "emma@example.com",
        country: "UK",
        specialization: "Wedding",
        bio: "Capturing love stories with elegance and creativity",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        availability: "available",
        verified: true,
        photoCount: 89,
        followers: 1800
      }
    ]);

    // Sample photos
    setPhotos([
      {
        id: 1,
        photographerId: 1,
        photographerName: "Sarah Johnson",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        caption: "Golden hour portrait session in the mountains",
        approved: true,
        likes: 234
      },
      {
        id: 2,
        photographerId: 2,
        photographerName: "Mike Chen",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        caption: "Misty morning at the lake",
        approved: true,
        likes: 567
      },
      {
        id: 3,
        photographerId: 3,
        photographerName: "Emma Rodriguez",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
        caption: "Beautiful wedding ceremony in the countryside",
        approved: true,
        likes: 890
      },
      {
        id: 4,
        photographerId: 1,
        photographerName: "Sarah Johnson",
        url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop",
        caption: "Street photography in downtown",
        approved: true,
        likes: 345
      },
      {
        id: 5,
        photographerId: 2,
        photographerName: "Mike Chen",
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
        caption: "Sunset over the mountains",
        approved: true,
        likes: 678
      },
      {
        id: 6,
        photographerId: 3,
        photographerName: "Emma Rodriguez",
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
        caption: "Intimate wedding moment",
        approved: true,
        likes: 456
      }
    ]);

    // Sample applications
    setApplications([
      {
        id: 1,
        userId: 4,
        name: "David Park",
        email: "david@example.com",
        experience: "5-10",
        specialization: "Fashion",
        portfolio: "https://davidpark.com",
        bio: "Fashion photographer with a passion for creative storytelling",
        status: "pending",
        submittedAt: new Date('2024-06-20')
      },
      {
        id: 2,
        userId: 5,
        name: "Lisa Wang",
        email: "lisa@example.com",
        experience: "3-5",
        specialization: "Wildlife",
        portfolio: "https://lisawang.com",
        bio: "Wildlife photographer documenting endangered species",
        status: "pending",
        submittedAt: new Date('2024-06-19')
      }
    ]);

    // Sample photo reviews
    setPhotoReviews([
      {
        id: 1,
        photographerId: 1,
        url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
        caption: "New portrait series",
        status: "pending",
        submittedAt: new Date('2024-06-22')
      }
    ]);
  };

  // Authentication functions
  const login = (email, password) => {
    // Simulate authentication
    if (email === 'admin@framelink.com' && password === 'admin123') {
      setCurrentUser({
        id: 999,
        name: 'Admin',
        email: email,
        role: 'admin'
      });
    } else if (email === 'sarah@example.com' && password === 'photographer123') {
      setCurrentUser({
        id: 1,
        name: 'Sarah Johnson',
        email: email,
        role: 'photographer'
      });
    } else {
      setCurrentUser({
        id: Date.now(),
        name: 'John Doe',
        email: email,
        role: 'user'
      });
    }
    showNotification('Login successful!', 'success');
    showPage('home');
  };

  const register = (name, email, password, country) => {
    setCurrentUser({
      id: Date.now(),
      name: name,
      email: email,
      role: 'user',
      country: country
    });
    showNotification('Registration successful!', 'success');
    showPage('home');
  };

  const logout = () => {
    setCurrentUser(null);
    setLoginEmail('');
    setLoginPassword('');
    showNotification('Logged out successfully!', 'success');
    showPage('home');
  };

  // Page navigation
  const showPage = (pageId) => {
    setCurrentPage(pageId);
  };

  // Notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // View photographer profile
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  
  const viewPhotographer = (photographerId) => {
    const photographer = photographers.find(p => p.id === photographerId);
    if (!photographer) return;
    setSelectedPhotographer(photographer);
    showPage('profile');
  };

  // Contact photographer
  const contactPhotographer = (photographerId) => {
    if (!currentUser) {
      showNotification('Please login to contact photographers', 'error');
      return;
    }

    const photographer = selectedPhotographer || photographers.find(p => p.id === photographerId);
    if (photographer) {
      showNotification(`Contact request sent to ${photographer.name}!`, 'success');
    }
  };

  // Filter photographers
  const [photographerFilters, setPhotographerFilters] = useState({
    country: '',
    category: '',
    availability: ''
  });

  const filterPhotographers = () => {
    return photographers.filter(p => {
      return p.verified &&
        (photographerFilters.country === '' || p.country === photographerFilters.country) &&
        (photographerFilters.category === '' || p.specialization === photographerFilters.category) &&
        (photographerFilters.availability === '' || p.availability === photographerFilters.availability);
    });
  };

  // Admin functions
  const [adminSection, setAdminSection] = useState('applications');

  const showAdminSection = (section) => {
    setAdminSection(section);
  };

  const approveApplication = (appId) => {
    const app = applications.find(a => a.id === appId);
    if (app) {
      setApplications(prev => prev.map(a => 
        a.id === appId ? { ...a, status: 'approved' } : a
      ));
      
      // Add to photographers list
      const newPhotographer = {
        id: Date.now(),
        name: app.name,
        email: app.email,
        specialization: app.specialization,
        bio: app.bio,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        country: "US",
        availability: "available",
        verified: true,
        photoCount: 0,
        followers: 0
      };
      setPhotographers(prev => [...prev, newPhotographer]);
      
      showNotification(`${app.name} approved as photographer!`, 'success');
    }
  };

  const rejectApplication = (appId) => {
    setApplications(prev => prev.map(a => 
      a.id === appId ? { ...a, status: 'rejected' } : a
    ));
    showNotification(`Application rejected`, 'success');
  };

  const approvePhoto = (photoId) => {
    const photo = photoReviews.find(p => p.id === photoId);
    if (photo) {
      setPhotoReviews(prev => prev.map(p => 
        p.id === photoId ? { ...p, status: 'approved' } : p
      ));
      
      // Add to public photos
      const newPhoto = {
        id: Date.now(),
        photographerId: photo.photographerId,
        photographerName: photographers.find(p => p.id === photo.photographerId)?.name || 'Unknown',
        url: photo.url,
        caption: photo.caption,
        approved: true,
        likes: 0
      };
      setPhotos(prev => [...prev, newPhoto]);
      
      showNotification('Photo approved!', 'success');
    }
  };

  const rejectPhoto = (photoId) => {
    setPhotoReviews(prev => prev.map(p => 
      p.id === photoId ? { ...p, status: 'rejected' } : p
    ));
    showNotification('Photo rejected', 'success');
  };

  const toggleUserStatus = (userId) => {
    showNotification('User status updated', 'success');
  };

  // Handle form submissions
  const handleLogin = (e) => {
    e.preventDefault();
    login(loginEmail, loginPassword);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const country = formData.get('country');
    register(name, email, password, country);
  };

  const handleApplication = (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      showNotification('Please login first', 'error');
      return;
    }

    const formData = new FormData(e.target);
    const experience = formData.get('experience');
    const specialization = formData.get('specialization');
    const portfolio = formData.get('portfolio');
    const bio = formData.get('bio');
    
    const newApplication = {
      id: Date.now(),
      userId: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      experience,
      specialization,
      portfolio,
      bio,
      status: 'pending',
      submittedAt: new Date()
    };
    
    setApplications(prev => [...prev, newApplication]);
    showNotification('Application submitted successfully! You will be notified once reviewed.', 'success');
    showPage('home');
  };

  const handlePhotoUpload = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const caption = formData.get('caption');
    
    // Simulate photo upload
    const newPhotoReview = {
      id: Date.now(),
      photographerId: currentUser.id,
      url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
      caption: caption,
      status: 'pending',
      submittedAt: new Date()
    };
    
    setPhotoReviews(prev => [...prev, newPhotoReview]);
    showNotification('Photo uploaded and sent for review!', 'success');
    e.target.reset();
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bio = formData.get('bio');
    const availability = formData.get('availability');
    
    setPhotographers(prev => prev.map(p => 
      p.id === currentUser.id ? { ...p, bio, availability } : p
    ));
    showNotification('Profile updated successfully!', 'success');
  };

  // Initialize on mount
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo">FrameLink</div>
            <div className="nav-links">
              <Link to="/login" className="nav-link">Login</Link>
              <span className="nav-link nav-link-underline" onClick={() => showPage('directory')}>Photographers</span>
              {!currentUser ? (
                <div id="nav-auth">
                  <span className="nav-link" href="./auth/Login.js" onClick={() => showPage('login')}>Login</span>
                  <span className="btn btn-primary" onClick={() => showPage('register')}>Sign Up</span>
                </div>
              ) : (
                <div id="nav-user">
                  {currentUser.role === 'user' && (
                    <span className="nav-link" onClick={() => showPage('apply')}>Become Photographer</span>
                  )}
                  {currentUser.role === 'photographer' && (
                    <span className="nav-link" onClick={() => showPage('dashboard')}>Dashboard</span>
                  )}
                  {currentUser.role === 'admin' && (
                    <span className="nav-link" onClick={() => showPage('admin')}>Admin</span>
                  )}
                  <span className="nav-link">{currentUser.name}</span>
                  <span className="nav-link" onClick={logout}>Logout</span>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">

          {/* Home Page */}
          {currentPage === 'home' && (
            <div className="page">
              <div className="hero">
                <h1>Discover Amazing Photography</h1>
                <p>Connect with talented photographers worldwide and explore stunning visual stories</p>
                <div className="flex justify-center gap-1 mt-2" style={{ display: 'flex', justifyContent: 'center' }}>
                  <span className="btn btn-primary" onClick={() => showPage('register')}>Join FrameLink</span>
                  <span className="btn btn-secondary" onClick={() => showPage('directory')}>Browse Photographers</span>
                </div>
              </div>
              <div className="photo-grid">
                {photos.filter(photo => photo.approved).map((photo, index) => (
                  <div className="photo-card" key={index}>
                    <img src={photo.url} alt={photo.caption} />
                    <div className="photo-info">
                      <h3>{photo.caption}</h3>
                      <div className="photographer-info">
                        <span>{photo.photographerName}</span>
                        <span className="verified-badge">Verified</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Login Page */}
          {currentPage === 'login' && (
            <div className="page">
              <div className="form-container">
                <h2 className="text-center mb-2">Welcome Back</h2>
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label htmlFor="login-email">Email</label>
                    <input
                      type="email"
                      id="login-email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="login-password">Password</label>
                    <input
                      type="password"
                      id="login-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                </form>
                <p className="text-center mt-2">
                  Don't have an account? <span onClick={() => showPage('register')} style={{ cursor: 'pointer', color: '#667eea' }}>Sign up</span>
                </p>
              </div>
            </div>
          )}

          {/* Register Page */}
          {currentPage === 'register' && (
            <div className="page">
              <div className="form-container">
                <h2 className="text-center mb-2">Join FrameLink</h2>
                <form onSubmit={handleRegister}>
                  <div className="form-group">
                    <label htmlFor="register-name">Full Name</label>
                    <input type="text" name="name" id="register-name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="register-email">Email</label>
                    <input type="email" name="email" id="register-email" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="register-password">Password</label>
                    <input type="password" name="password" id="register-password" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="register-country">Country</label>
                    <select name="country" id="register-country" required>
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Account</button>
                </form>
                <p className="text-center mt-2">
                  Already have an account? <span onClick={() => showPage('login')} style={{ cursor: 'pointer', color: '#667eea' }}>Login</span>
                </p>
              </div>
            </div>
          )}

          {/* Photographer Application */}
          {currentPage === 'apply' && (
            <div className="page">
              <div className="form-container" style={{ maxWidth: '600px' }}>
                <h2 className="text-center mb-2">Become a Verified Photographer</h2>
                <form onSubmit={handleApplication}>
                  <div className="form-group">
                    <label htmlFor="app-experience">Years of Experience</label>
                    <select name="experience" id="app-experience" required>
                      <option value="">Select Experience Level</option>
                      <option value="1-2">1-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="app-specialization">Specialization</label>
                    <select name="specialization" id="app-specialization" required>
                      <option value="">Select Specialization</option>
                      <option value="Portrait">Portrait</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Landscape">Landscape</option>
                      <option value="Street">Street Photography</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Wildlife">Wildlife</option>
                      <option value="Architecture">Architecture</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="app-portfolio">Portfolio URL</label>
                    <input type="url" name="portfolio" id="app-portfolio" placeholder="https://yourportfolio.com" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="app-bio">Professional Bio</label>
                    <textarea name="bio" id="app-bio" rows="4" placeholder="Tell us about your photography journey and style..." required></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="app-samples">Sample Photos (Upload 3-5 best works)</label>
                    <input type="file" id="app-samples" multiple accept="image/*" required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Application</button>
                </form>
              </div>
            </div>
          )}

          {/* Directory Page */}
          {currentPage === 'directory' && (
            <div className="page">
              <div className="directory-filters">
                <select 
                  className="filter-select" 
                  value={photographerFilters.country}
                  onChange={(e) => setPhotographerFilters(prev => ({ ...prev, country: e.target.value }))}
                >
                  <option value="">All Countries</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                </select>
                <select 
                  className="filter-select"
                  value={photographerFilters.category}
                  onChange={(e) => setPhotographerFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">All Categories</option>
                  <option value="Portrait">Portrait</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Landscape">Landscape</option>
                  <option value="Street">Street Photography</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Wildlife">Wildlife</option>
                  <option value="Architecture">Architecture</option>
                </select>
                <select 
                  className="filter-select"
                  value={photographerFilters.availability}
                  onChange={(e) => setPhotographerFilters(prev => ({ ...prev, availability: e.target.value }))}
                >
                  <option value="">All Availability</option>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                </select>
              </div>

              <div className="photographer-grid">
                {filterPhotographers().map((photographer) => (
                  <div className="photographer-card" key={photographer.id}>
                    <img src={photographer.avatar} alt={photographer.name} className="photographer-avatar" />
                    <h3>{photographer.name}</h3>
                    <p className="photographer-specialization">{photographer.specialization}</p>
                    <p className="photographer-bio">{photographer.bio}</p>
                    <div className="photographer-stats">
                      <span>{photographer.photoCount} photos</span>
                      <span>{photographer.followers} followers</span>
                    </div>
                    <div className={`availability-badge ${photographer.availability}`}>
                      {photographer.availability === 'available' ? 'Available' : 'Busy'}
                    </div>
                    <div className="photographer-actions">
                      <button className="btn btn-secondary" onClick={() => viewPhotographer(photographer.id)}>View Profile</button>
                      <button className="btn btn-primary" onClick={() => contactPhotographer(photographer.id)}>Contact</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Page */}
          {currentPage === 'profile' && selectedPhotographer && (
            <div className="page">
              <div className="profile-header">
                <img src={selectedPhotographer.avatar} alt="Profile" className="profile-avatar" />
                <h1 className="profile-name">{selectedPhotographer.name}</h1>
                <div className="verified-badge">Verified Photographer</div>
                <p className="profile-bio">{selectedPhotographer.bio}</p>
                <div className="profile-stats">
                  <div className="stat">
                    <div className="stat-number">{selectedPhotographer.photoCount}</div>
                    <div className="stat-label">Photos</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">{selectedPhotographer.followers}</div>
                    <div className="stat-label">Followers</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">{selectedPhotographer.specialization}</div>
                    <div className="stat-label">Specialty</div>
                  </div>
                </div>
                <div className="mt-2">
                  <button className="btn btn-primary" onClick={() => contactPhotographer(selectedPhotographer.id)}>Contact Photographer</button>
                </div>
              </div>

              <div className="photo-grid">
                {photos.filter(photo => photo.photographerId === selectedPhotographer.id && photo.approved).map((photo, index) => (
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
          )}

          {/* Dashboard */}
            {currentPage === 'dashboard' && currentUser?.role === 'photographer' && (
            <div className="page">
                <h2 className="mb-2">Photographer Dashboard</h2>

                {/* Upload New Photo */}
                <div className="admin-card">
                <h3>Upload New Photo</h3>
                <form id="photo-upload-form" onSubmit={handlePhotoUpload}>
                    <div className="form-group">
                    <label htmlFor="photo-file">Select Photo</label>
                    <input type="file" id="photo-file" accept="image/*" required />
                    </div>
                    <div className="form-group">
                    <label htmlFor="photo-caption">Caption</label>
                    <textarea id="photo-caption" rows="3" placeholder="Describe your photo..."></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Upload Photo</button>
                </form>
                </div>

                {/* Profile Management */}
                <div className="admin-card">
                <h3>Profile Management</h3>
                <form id="profile-update-form" onSubmit={handleProfileUpdate}>
                    <div className="form-group">
                    <label htmlFor="profile-photo">Profile Photo</label>
                    <input type="file" id="profile-photo" accept="image/*" />
                    </div>
                    <div className="form-group">
                    <label htmlFor="profile-bio-edit">Bio</label>
                    <textarea id="profile-bio-edit" rows="4" placeholder="Tell your story..."></textarea>
                    </div>
                    <div className="form-group">
                    <label htmlFor="profile-availability">Availability</label>
                    <select id="profile-availability">
                        <option value="available">Available for bookings</option>
                        <option value="busy">Currently busy</option>
                    </select>
                    </div>
                    <div className="form-group">
                    <label htmlFor="profile-instagram">Social Media Links</label>
                    <input type="url" id="profile-instagram" placeholder="Instagram URL" className="mb-2" />
                    <input type="url" id="profile-website" placeholder="Website URL" />
                    </div>
                    <button type="submit" className="btn btn-primary">Update Profile</button>
                </form>
                </div>
            </div>
            )}

            {/* Admin Dashboard */}
                {currentPage === 'admin' && currentUser?.role === 'admin' && (
                <div className="page">
                    <div className="admin-nav">
                    <div className="container">
                        <div className="admin-nav-links">
                        <a href="#" className={`admin-nav-link ${adminSection === 'applications' ? 'active' : ''}`} onClick={() => showAdminSection('applications')}>Applications</a>
                        <a href="#" className={`admin-nav-link ${adminSection === 'photos' ? 'active' : ''}`} onClick={() => showAdminSection('photos')}>Photo Reviews</a>
                        <a href="#" className={`admin-nav-link ${adminSection === 'users' ? 'active' : ''}`} onClick={() => showAdminSection('users')}>User Management</a>
                        <a href="#" className={`admin-nav-link ${adminSection === 'reports' ? 'active' : ''}`} onClick={() => showAdminSection('reports')}>Reports</a>
                        </div>
                    </div>
                    </div>

                    <div className="admin-content">
                    {/* Applications Section */}
                    {adminSection === 'applications' && (
                        <div className="admin-section">
                        <h2 className="mb-2">Photographer Applications</h2>
                        <div id="applications-list">
                            {/* Applications will be loaded here */}
                        </div>
                        </div>
                    )}

                    {/* Photo Reviews Section */}
                    {adminSection === 'photos' && (
                        <div className="admin-section">
                        <h2 className="mb-2">Photo Review Queue</h2>
                        <div id="photo-reviews-list">
                            {/* Photo reviews will be loaded here */}
                        </div>
                        </div>
                    )}

                    {/* User Management Section */}
                    {adminSection === 'users' && (
                        <div className="admin-section">
                        <h2 className="mb-2">User Management</h2>
                        <div id="users-list">
                            {/* Users will be loaded here */}
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
                        </div>
                    )}
                    </div>
                </div>
                )}

                
        </div>
      </div>
    </div>
    );
}


export default App;