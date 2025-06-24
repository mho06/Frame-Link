import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './style.css';

// Import page components
import HomePage from './HomePage';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import Admin from './Admin';
import Directory from './Directory';
import Apply from './Apply';
import Dashboard from './Dashboard';

// Main App Component
const App = () => {
  // Application State
  const [currentUser, setCurrentUser] = useState(null);
  const [photographers, setPhotographers] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [applications, setApplications] = useState([]);
  const [photoReviews, setPhotoReviews] = useState([]);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const navigate = useNavigate();

  // Notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

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
    navigate('/');
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
    navigate('/');
  };

  const logout = () => {
    setCurrentUser(null);
    showNotification('Logged out successfully!', 'success');
    navigate('/');
  };

  // View photographer profile
  const viewPhotographer = (photographerId) => {
    const photographer = photographers.find(p => p.id === photographerId);
    if (!photographer) return;
    setSelectedPhotographer(photographer);
    navigate('/profile');
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

  // Admin functions
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

  const handleApplication = (formData) => {
    if (!currentUser) {
      showNotification('Please login first', 'error');
      return;
    }
    
    const newApplication = {
      id: Date.now(),
      userId: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      experience: formData.experience,
      specialization: formData.specialization,
      portfolio: formData.portfolio,
      bio: formData.bio,
      status: 'pending',
      submittedAt: new Date()
    };
    
    setApplications(prev => [...prev, newApplication]);
    showNotification('Application submitted successfully! You will be notified once reviewed.', 'success');
    navigate('/');
  };

  const handlePhotoUpload = (caption) => {
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
  };

  const handleProfileUpdate = (bio, availability) => {
    setPhotographers(prev => prev.map(p => 
      p.id === currentUser.id ? { ...p, bio, availability } : p
    ));
    showNotification('Profile updated successfully!', 'success');
  };

  // Initialize on mount
  useEffect(() => {
    initializeData();
  }, []);

  // Header component
  const Header = () => (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>FrameLink</div>
          <div className="nav-links">
            <span className="nav-link nav-link-underline" onClick={() => navigate('/directory')}>Photographers</span>
            {!currentUser ? (
              <div id="nav-auth">
                <span className="nav-link" onClick={() => navigate('/login')}>Login</span>
                <span className="btn btn-primary" onClick={() => navigate('/register')}>Sign Up</span>
              </div>
            ) : (
              <div id="nav-user">
                {currentUser.role === 'user' && (
                  <span className="nav-link" onClick={() => navigate('/apply')}>Become Photographer</span>
                )}
                {currentUser.role === 'photographer' && (
                  <span className="nav-link" onClick={() => navigate('/dashboard')}>Dashboard</span>
                )}
                {currentUser.role === 'admin' && (
                  <span className="nav-link" onClick={() => navigate('/admin')}>Admin</span>
                )}
                <span className="nav-link">{currentUser.name}</span>
                <span className="nav-link" onClick={logout}>Logout</span>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );

  return (
    <div style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
        </div>
      )}

      <Header />

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage photos={photos} />} />
            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/register" element={<Register onRegister={register} />} />
            <Route path="/directory" element={<Directory 
              photographers={photographers} 
              onViewPhotographer={viewPhotographer}
              onContactPhotographer={contactPhotographer}
              currentUser={currentUser}
              showNotification={showNotification}
            />} />
            <Route path="/profile" element={<Profile 
              photographer={selectedPhotographer}
              photos={photos}
              onContactPhotographer={contactPhotographer}
            />} />
            <Route path="/apply" element={<Apply 
              onSubmitApplication={handleApplication}
            />} />
            <Route path="/dashboard" element={<Dashboard 
              currentUser={currentUser}
              onPhotoUpload={handlePhotoUpload}
              onProfileUpdate={handleProfileUpdate}
            />} />
            <Route path="/admin" element={<Admin 
              currentUser={currentUser}
              applications={applications}
              photoReviews={photoReviews}
              onApproveApplication={approveApplication}
              onRejectApplication={rejectApplication}
              onApprovePhoto={approvePhoto}
              onRejectPhoto={rejectPhoto}
            />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;