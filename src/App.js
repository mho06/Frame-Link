import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './style.css';
import supabase from './supabase';

// Import page components
import HomePage from './HomePage';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import Admin from './Admin';
import Directory from './Directory';
import Apply from './Apply';
import Dashboard from './Dashboard';

// ============ UTILITY COMPONENTS ============
const LoadingSpinner = ({ size = 'medium', color = '#667eea' }) => {
  const sizes = { small: '20px', medium: '40px', large: '60px' };
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '20px',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{
        width: sizes[size],
        height: sizes[size],
        border: `3px solid #f3f3f3`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
};

const FullPageLoading = ({ message = "Loading..." }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', flexDirection: 'column',
    zIndex: 9999, gap: '20px'
  }}>
    <LoadingSpinner size="large" />
    <p style={{ fontSize: '16px', color: '#666' }}>{message}</p>
  </div>
);

// ============ MAIN APP COMPONENT ============
const App = () => {
  // ============ STATE MANAGEMENT ============
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [photographers, setPhotographers] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [applications, setApplications] = useState([]);
  const [photoReviews, setPhotoReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const [isLoadingPhotographers, setIsLoadingPhotographers] = useState(false);

  // Loading states
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [setIsLoadingApplications] = useState(false);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
const location = useLocation();

  // Notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const navigate = useNavigate();

  // ============ UTILITY FUNCTIONS ============
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  }, []);

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserAvatar = (user) => {
    if (!user) return '';
    const initials = getUserInitials(user.name);
    let backgroundColor = '6b7280';
    
    if (user.role === 'admin') backgroundColor = 'dc2626';
    else if (user.role === 'photographer') backgroundColor = '667eea';
    
    return `https://ui-avatars.com/api/?name=${initials}&background=${backgroundColor}&color=fff&size=40`;
  };

  // ============ DATABASE FUNCTIONS ============
  // 1. Fix the photographer data mapping in App.js fetchPhotographers function
const fetchPhotographers = useCallback(async () => {
  setIsLoadingPhotographers(true);
  try {
    // Fetch approved applications (photographers)
    const { data: approvedApps, error: appsError } = await supabase
      .from('applications')
      .select('*')
      .eq('status', 'approved');

    if (appsError) {
      console.error('Error fetching photographers:', appsError);
      showNotification('Failed to load photographers', 'error');
      setPhotographers([]);
      return;
    }

    // Fetch all approved photos to count by user
    const { data: photoData, error: photoError } = await supabase
      .from('photos')
      .select('user_id')
      .eq('approved', true);

    if (photoError) {
      console.error('Error fetching photos for counts:', photoError);
    }

    // Count photos per photographer
    const photoCountMap = {};
    photoData?.forEach(photo => {
      const userId = photo.user_id;
      photoCountMap[userId] = (photoCountMap[userId] || 0) + 1;
    });

    // Enrich photographers with extra info
    const enrichedPhotographers = approvedApps.map(app => ({
      id: app.user_id,
      name: app.name,
      email: app.email,
      bio: app.bio || '',
      specialization: app.specialization || '',
      country: app.country || '',
      avatar: app.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=667eea&color=fff`,
      availability: app.availability || 'available',
      followers: 0,
      role: 'photographer',
      verified: true,
      photoCount: photoCountMap[app.user_id] || 0
    }));

    console.log('✅ Loaded photographers:', enrichedPhotographers);
    setPhotographers(enrichedPhotographers);
    console.log("Photographers set:", enrichedPhotographers);


  } catch (error) {
    console.error('Error in fetchPhotographers:', error);
    showNotification('Connection error loading photographers', 'error');
    setPhotographers([]);
  } finally {
    setIsLoadingPhotographers(false);
  }
}, [showNotification]);


// Add this to test your connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('applications').select('count').limit(1);
    console.log('Supabase connection test:', { data, error });
  } catch (err) {
    console.error('Supabase connection failed:', err);
  }
};
  const fetchPhotos = useCallback(async () => {
    try {
      // Try with join first
      let { data, error } = await supabase
        .from('photos')
        .select(`*, profiles!photos_user_id_fkey (full_name)`)
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(30);

      // Fallback if join fails
      if (error && error.code === 'PGRST200') {
        const { data: photosData, error: photosError } = await supabase
          .from('photos')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false });

        if (photosError) {
          console.error('Error fetching photos:', photosError);
          return;
        }

        const userIds = [...new Set(photosData.map(photo => photo.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        data = photosData.map(photo => ({
          ...photo,
          profiles: profiles?.find(p => p.id === photo.user_id)
        }));
      } else if (error) {
        console.error('Error fetching photos:', error);
        return;
      }

      const photosData = (data || []).map(photo => ({
        id: photo.id,
        photographerId: photo.user_id,
        photographerName: photo.profiles?.full_name || 'Unknown', // ✅ fixed here
        url: photo.url,
        caption: photo.caption,
        approved: photo.approved,
        likes: photo.likes || 0,
        createdAt: photo.created_at
      }));


      setPhotos(photosData);
    } catch (error) {
      console.error('Error in fetchPhotos:', error);
      setPhotos([]);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      showNotification('Failed to load users', 'error');
      return;
    }

    // Transform the data to match your expected format
    const usersData = (data || []).map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user', // Default to 'user' if no role
      country: user.country,
      status: user.status || 'active', // Default to 'active' if no status
      createdAt: user.created_at,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=6b7280&color=fff`
    }));

    setUsers(usersData);
    console.log('Fetched users:', usersData); // Debug log
  } catch (error) {
    console.error('Error in fetchUsers:', error);
    setUsers([]);
  }
}, [showNotification]);

  const fetchPhotoReviews = useCallback(async () => {
    try {
      let { data, error } = await supabase
        .from('photos')
        .select(`*, profiles!photos_user_id_fkey (name)`)
        .eq('approved', false)
        .order('created_at', { ascending: false })
        .limit(20);

      // Fallback if join fails
      if (error && error.code === 'PGRST200') {
        const { data: photosData, error: photosError } = await supabase
          .from('photos')
          .select('*')
          .eq('approved', false)
          .order('created_at', { ascending: false });

        if (photosError) {
          console.error('Error fetching photo reviews:', photosError);
          return;
        }

        const userIds = [...new Set(photosData.map(photo => photo.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', userIds);

        data = photosData.map(photo => ({
          ...photo,
          profiles: profiles?.find(p => p.id === photo.user_id)
        }));
      } else if (error) {
        console.error('Error fetching photo reviews:', error);
        return;
      }

      const reviewsData = (data || []).map(photo => ({
        id: photo.id,
        photographerId: photo.user_id,
        photographerName: photo.profiles?.name || 'Unknown',
        url: photo.url,
        caption: photo.caption,
        status: 'pending',
        submittedAt: photo.created_at
      }));

      setPhotoReviews(reviewsData);
    } catch (error) {
      console.error('Error in fetchPhotoReviews:', error);
      setPhotoReviews([]);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    setIsLoadingApplications(true);
    try {
      let { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      // Fallback if created_at doesn't exist
      if (error && error.code === '42703') {
        const result = await supabase.from('applications').select('*');
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('Error fetching applications:', error);
        showNotification('Failed to load applications', 'error');
        return;
      }

      const transformedApplications = (data || []).map(app => {
        let images = [];
        if (app.images) {
          try {
            images = typeof app.images === 'string' ? JSON.parse(app.images) : app.images;
          } catch (e) {
            console.warn('Failed to parse images for application', app.id, e);
            images = [];
          }
        }
        
        return {
          id: app.id,
          userId: app.user_id,
          name: app.name || '',
          email: app.email || '',
          experience: app.experience || '',
          specialization: app.specialization || '',
          portfolio: app.portfolio || '',
          bio: app.bio || '',
          status: app.status || 'pending',
          images: images,
          submittedAt: app.created_at || new Date().toISOString()
        };
      });
      
      transformedApplications.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      setApplications(transformedApplications);
      
    } catch (error) {
      console.error('Error in fetchApplications:', error);
      showNotification('Failed to load applications', 'error');
    } finally {
      setIsLoadingApplications(false);
    }
  }, [showNotification]);

  const checkUserPhotographerStatus = useCallback(async (userId) => {
    try {
      const { data: approvedApp, error } = await supabase
        .from('applications')
        .select('status')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking photographer status:', error);
        return false;
      }

      return !!approvedApp;
    } catch (error) {
      console.error('Error in checkUserPhotographerStatus:', error);
      return false;
    }
  }, []);

  // ============ AUTHENTICATION FUNCTIONS ============
  const login = async (userData) => {
  setIsLoggingIn(true);
  try {
    // Remove the async photographer check for now since it's causing delays
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    showNotification('Login successful!', 'success');
    navigate('/');
    
  } catch (error) {
    console.error('Login error:', error);
    showNotification('Login failed', 'error');
  } finally {
    setIsLoggingIn(false);
  }
};

  const register = async (name, email, password, country) => {
    setIsLoggingIn(true);
    try {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userRole = email === 'admin@framelink.com' ? 'admin' : 'user';
      
      const newUser = { id: userId, name, email, role: userRole, country };

      setTimeout(() => {
        setCurrentUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        showNotification('Registration successful!', 'success');
        navigate('/');
        setIsLoggingIn(false);
      }, 500);
      
    } catch (error) {
      console.error('Registration error:', error);
      showNotification('Registration failed', 'error');
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedPhotographer(null);
    localStorage.removeItem('currentUser');
    showNotification('Logged out successfully!', 'success');
    navigate('/');
  };

  // ============ PROFILE FUNCTIONS ============
  const viewPhotographer = (photographerId) => {
    const photographer = photographers.find(p => p.id === photographerId);
    if (!photographer) return;
    setSelectedPhotographer(photographer);
    navigate('/profile');
  };

  const viewMyProfile = () => {
    if (!currentUser) {
      showNotification('Please login to view your profile', 'error');
      return;
    }

    let profile;
    if (currentUser.role === 'photographer') {
      const photographerData = photographers.find(p => p.id === currentUser.id);
      profile = photographerData || {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        country: currentUser.country,
        specialization: 'Not specified',
        bio: 'Professional photographer',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=667eea&color=fff`,
        availability: "available",
        verified: true,
        photoCount: photos.filter(p => p.photographerId === currentUser.id).length,
        followers: 0,
        role: 'photographer'
      };
    } else if (currentUser.role === 'admin') {
      profile = {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        country: currentUser.country,
        specialization: 'Administrator',
        bio: 'Platform Administrator',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=dc2626&color=fff`,
        availability: "N/A",
        verified: true,
        photoCount: 0,
        followers: 0,
        role: 'admin'
      };
    } else {
      profile = {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        country: currentUser.country,
        specialization: 'Platform Member',
        bio: 'Member of Framelink',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=6b7280&color=fff`,
        availability: "N/A",
        verified: false,
        photoCount: 0,
        followers: 0,
        role: 'user'
      };
    }
    
    setSelectedPhotographer(profile);
    navigate('/profile');
  };

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

  // ============ ADMIN FUNCTIONS ============
  const approveApplication = async (appId) => {
    try {
      const { error: approveError } = await supabase
        .from('applications')
        .update({ status: 'approved' })
        .eq('id', appId);

      if (approveError) {
        console.error('Error approving application:', approveError);
        showNotification('Failed to approve application', 'error');
        return;
      }

      const app = applications.find(a => a.id === appId);
      
      if (app) {
        await supabase
          .from('profiles')
          .update({ role: 'photographer' })
          .eq('id', app.userId);

        if (currentUser && currentUser.id === app.userId) {
          setCurrentUser(prev => ({ ...prev, role: 'photographer' }));
        }
        
        showNotification(`${app.name} approved as photographer!`, 'success');
      }
      
      await Promise.all([fetchApplications(), fetchPhotographers()]);
      
    } catch (error) {
      console.error('Error in approveApplication:', error);
      showNotification('Failed to approve application', 'error');
    }
  };

  const rejectApplication = async (appId) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('id', appId);

      if (error) {
        console.error('Error rejecting application:', error);
        showNotification('Failed to reject application', 'error');
      } else {
        showNotification('Application rejected', 'success');
        await fetchApplications();
      }
    } catch (error) {
      console.error('Error in rejectApplication:', error);
      showNotification('Failed to reject application', 'error');
    }
  };

  const approvePhoto = async (photoId) => {
  try {
    // First check if photo exists
    const { data: existingPhoto, error: checkError } = await supabase
      .from('photos')
      .select('id')
      .eq('id', photoId)
      .single();

    if (checkError || !existingPhoto) {
      console.error('Photo not found:', photoId);
      showNotification('Photo not found in database', 'error');
      // Remove from local state since it doesn't exist in DB
      setPhotoReviews(prev => prev.filter(p => p.id !== photoId));
      return;
    }

    const { error } = await supabase
      .from('photos')
      .update({ approved: true })
      .eq('id', photoId);

    if (error) {
      console.error('Error approving photo:', error);
      showNotification('Failed to approve photo', 'error');
    } else {
      showNotification('Photo approved!', 'success');
      await Promise.all([fetchPhotos(), fetchPhotoReviews()]);
    }
  } catch (error) {
    console.error('Error in approvePhoto:', error);
    showNotification('Failed to approve photo', 'error');
  }
};

const rejectPhoto = async (photoId) => {
  try {
    // First check if photo exists
    const { data: existingPhoto, error: checkError } = await supabase
      .from('photos')
      .select('id')
      .eq('id', photoId)
      .single();

    if (checkError || !existingPhoto) {
      console.error('Photo not found:', photoId);
      showNotification('Photo not found in database', 'error');
      // Remove from local state since it doesn't exist in DB
      setPhotoReviews(prev => prev.filter(p => p.id !== photoId));
      return;
    }

    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId);

    if (error) {
      console.error('Error rejecting photo:', error);
      showNotification('Failed to reject photo', 'error');
    } else {
      showNotification('Photo rejected', 'success');
      await fetchPhotoReviews();
    }
  } catch (error) {
    console.error('Error in rejectPhoto:', error);
    showNotification('Failed to reject photo', 'error');
  }
};

  // ============ APPLICATION & PHOTO HANDLERS ============
  const handleApplication = async (formData) => {
    if (!currentUser) {
      showNotification('Please login first', 'error');
      return;
    }

    setIsSubmittingApplication(true);
    try {
      const imagesData = formData.images && formData.images.length > 0
        ? JSON.stringify(Array.isArray(formData.images) ? formData.images : formData.images)
        : JSON.stringify([]);

      const applicationData = {
        user_id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        experience: formData.experience,
        specialization: formData.specialization,
        portfolio: formData.portfolio,
        bio: formData.bio,
        status: 'pending',
        images: imagesData
      };

      const { error } = await supabase
        .from('applications')
        .insert(applicationData)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        showNotification(`Failed to submit application: ${error.message}`, 'error');
        return;
      }

      showNotification('Application submitted! You will be notified once reviewed.', 'success');
      await fetchApplications();
      navigate('/');
      
    } catch (error) {
      console.error('Error in handleApplication:', error);
      showNotification('Failed to submit application.', 'error');
    } finally {
      setIsSubmittingApplication(false);
    }
  };

const handlePhotoUpload = async (caption, file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${currentUser.id}_${Date.now()}.${fileExt}`;

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase
      .storage
      .from('photos')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      showNotification('Failed to upload photo file', 'error');
      return;
    }

    // Get the public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('photos')
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // Now insert into the database with the real URL
    const { data, error } = await supabase
      .from('photos')
      .insert({
        user_id: currentUser.id,
        url: publicUrl, // ✅ Use real URL here
        caption: caption,
        approved: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error uploading photo record:', error);
      showNotification('Failed to upload photo to database', 'error');
      return;
    }

    showNotification('Photo uploaded successfully and sent for review!', 'success');
  } catch (error) {
    console.error('Error in handlePhotoUpload:', error);
    showNotification('Failed to upload photo', 'error');
  }
};



  const handleProfileUpdate = async (bio, availability, avatarFile, removeAvatar) => {
  setIsUpdatingProfile(true);
  try {
    let newAvatarUrl = selectedPhotographer?.avatar;

    if (removeAvatar) {
      newAvatarUrl = '';
    } else if (avatarFile) {
      const reader = new FileReader();
      newAvatarUrl = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(avatarFile);
      });
    }

    // Update photographers array
    setPhotographers(prev => prev.map(p => 
      p.id === currentUser.id ? { ...p, bio, availability, avatar: newAvatarUrl } : p
    ));
    
    // Update selected photographer immediately
    if (selectedPhotographer && selectedPhotographer.id === currentUser.id) {
      const updatedPhotographer = { ...selectedPhotographer, bio, availability, avatar: newAvatarUrl };
      setSelectedPhotographer(updatedPhotographer);
    }
    
    // Update current user if avatar changed
    if (currentUser.id === selectedPhotographer?.id) {
      const updatedUser = { ...currentUser, avatar: newAvatarUrl };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    
    showNotification('Profile updated successfully!', 'success');
  } catch (error) {
    console.error('Error updating profile:', error);
    showNotification('Failed to update profile', 'error');
  } finally {
    setIsUpdatingProfile(false);
  }
};

  // ============ HELPER FUNCTIONS ============
  // const getUserPhotos = (userId) => photoReviews.filter(photo => photo.photographerId === userId);
  const getUserPhotos = (userId) => {
  if (!userId) return [];
  
  // Get all photos for this user (both approved and pending)
  const approvedPhotos = photos.filter(photo => photo.photographerId === userId);
  const pendingPhotos = photoReviews.filter(photo => photo.photographerId === userId);
  
  // Combine and mark with status
  const allUserPhotos = [
    ...approvedPhotos.map(photo => ({ ...photo, status: 'approved' })),
    ...pendingPhotos.map(photo => ({ ...photo, status: 'pending' }))
  ];
  
  return allUserPhotos;
};

  const getUserPhotoStats = (userId) => {
  if (!userId) return { total: 0, pending: 0, approved: 0, rejected: 0 };
  
  const userPhotos = getUserPhotos(userId);
  const approvedCount = photos.filter(photo => photo.photographerId === userId).length;
  const pendingCount = photoReviews.filter(photo => photo.photographerId === userId).length;
  
  return {
    total: userPhotos.length,
    pending: pendingCount,
    approved: approvedCount,
    rejected: 0 // You'd need to track rejected photos separately if needed
  };
};

  // ============ EFFECTS ============
  useEffect(() => {
    fetchPhotographers();
    fetchPhotos();
  }, []);

  

  useEffect(() => {
  if (currentUser?.role === 'admin' && location.pathname === '/admin') {
    const loadAdminData = async () => {
      try {
        await Promise.all([
          fetchPhotographers(),
          fetchPhotos(),
          fetchPhotoReviews(),
          fetchApplications(),
          fetchUsers() // Add this line
        ]);
      } catch (error) {
        console.error('Error loading admin data:', error);
        showNotification('Some admin data failed to load', 'error');
      }
    };
    loadAdminData();
  }
}, [currentUser?.id, fetchPhotographers, fetchPhotos, fetchPhotoReviews, fetchApplications, fetchUsers, showNotification, location.pathname]);

  // ============ HEADER COMPONENT ============
  const Header = () => (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            Framelink
          </div>
          <div className="nav-links">
            <span className="nav-link nav-link-underline" onClick={() => navigate('/directory')}>
              Photographers
            </span>
            {!currentUser ? (
              <div id="nav-auth">
                <span className="nav-link nav-link-underline" onClick={() => navigate('/login')}>
                  Login
                </span>
                <span className="nav-link nav-link-underline" onClick={() => navigate('/register')}>
                  Sign Up
                </span>
              </div>
            ) : (
              <div id="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="nav-link nav-link-underline" onClick={viewMyProfile}>
                  <img 
                    src={getUserAvatar(currentUser)} 
                    alt="Profile" 
                    style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', 
                      marginRight: '8px', verticalAlign: 'middle'
                    }} 
                  />
                  My Profile
                </span>
                {currentUser.role === 'user' && (
                  <span className="nav-link nav-link-underline" onClick={() => navigate('/apply')}>
                    Become Photographer
                  </span>
                )}
                {currentUser.role === 'photographer' && (
                  <span className="nav-link nav-link-underline" onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </span>
                )}
                {currentUser.role === 'admin' && (
                  <span className="nav-link nav-link-underline" onClick={() => navigate('/admin')}>
                    Admin Panel
                  </span>
                )}
                <span className="nav-link nav-link-underline" onClick={logout}>
                  Logout
                </span>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );

  // ============ RENDER ============
  if (isLoggingIn) {
    return (
      <div style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        <Header />
        <FullPageLoading message="Logging you in..." />
      </div>
    );
  }

  return (
    <div style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
        </div>
      )}

      <Header />

      <div className="main-content">
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  photos={photos}
                  currentUser={currentUser}
                  onLikePhoto={async (photoId, liked) => {
  if (!currentUser) return;

  const photo = photos.find(p => p.id === photoId);
  if (!photo) return;

  const updatedLikes = liked
    ? (photo.likes || 0) + 1
    : Math.max((photo.likes || 1) - 1, 0);

  const { error } = await supabase
    .from('photos')
    .update({ likes: updatedLikes })
    .eq('id', photoId);

  if (error) {
    console.error('❌ Failed to update likes:', error);
    return;
  }

  // ✅ Immediately fetch updated photos
  fetchPhotos();
}}


                  onCommentPhoto={async (photoId, commentText) => {
  if (!currentUser || !commentText.trim()) return;

  const { error } = await supabase
    .from('comments')
    .insert([
      {
        photo_id: photoId,
        user_id: currentUser.id,
        comment: commentText.trim(),
        timestamp: new Date().toISOString(),
      },
    ]);

  if (error) {
    console.error('❌ Failed to save comment:', error);
  } else {
    console.log('✅ Comment saved to Supabase');

    // ✅ OPTIONAL: Refetch photos or comments if needed
    // If comments are shown via fetchComments(), no need to refetch photos here
  }
}}



                  onViewPhotographer={viewPhotographer}
                />
              }
            />

            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/register" element={<Register onRegister={register} />} />
            <Route path="/directory" element={
              <Directory 
                photographers={photographers} 
                onViewPhotographer={viewPhotographer}
                onContactPhotographer={contactPhotographer}
                currentUser={currentUser}
                showNotification={showNotification}
              />
            } />
            <Route path="/profile" element={
              <Profile 
                photographer={selectedPhotographer}
                photos={photos}
                onContactPhotographer={contactPhotographer}
                currentUser={currentUser}
                isOwnProfile={selectedPhotographer?.id === currentUser?.id}
                onProfileUpdate={handleProfileUpdate}
                isUpdatingProfile={isUpdatingProfile}
              />
            } />
            <Route path="/apply" element={
              <Apply 
                onSubmitApplication={handleApplication}
                isSubmitting={isSubmittingApplication}
              />
            } />
            <Route path="/dashboard" element={
              <Dashboard 
                currentUser={currentUser}
                onPhotoUpload={handlePhotoUpload}
                onProfileUpdate={handleProfileUpdate}
                isUpdatingProfile={isUpdatingProfile}
                userPhotos={getUserPhotos(currentUser?.id)}
                photoStats={getUserPhotoStats(currentUser?.id)}
                key={currentUser?.id}
              />
            } />
            <Route path="/admin" element={
              <Admin 
                currentUser={currentUser}
                applications={applications}
                photoReviews={photoReviews}
                users={users}
                onApproveApplication={approveApplication}
                onRejectApplication={rejectApplication}
                onApprovePhoto={approvePhoto}
                onRejectPhoto={rejectPhoto}
              />
            } />
        </Routes>

        </div>
      </div>
    </div>
  );
};

export default App;