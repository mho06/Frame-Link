import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './style.css';
import { supabase } from './supabase';

// Import page components
import HomePage from './HomePage';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import Admin from './Admin';
import Directory from './Directory';
import Apply from './Apply';
import Dashboard from './Dashboard';

// Loading Spinner Component
const LoadingSpinner = ({ size = 'medium', color = '#667eea' }) => {
  const sizes = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  const spinnerStyle = {
    width: sizes[size],
    height: sizes[size],
    border: `3px solid #f3f3f3`,
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '20px',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={spinnerStyle}></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

// Full Page Loading Component
const FullPageLoading = ({ message = "Loading..." }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    zIndex: 9999,
    gap: '20px'
  }}>
    <LoadingSpinner size="large" />
    <p style={{ fontSize: '16px', color: '#666' }}>{message}</p>
  </div>
);

// Main App Component
const App = () => {
  // Application State
  // const [currentUser, setCurrentUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
  const storedUser = localStorage.getItem('currentUser');
  return storedUser ? JSON.parse(storedUser) : null;
});

  const [photographers, setPhotographers] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [applications, setApplications] = useState([]);
  const [photoReviews, setPhotoReviews] = useState([]);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const navigate = useNavigate();

  // Loading states
  // const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Function to fetch real photographers from Supabase
  const fetchPhotographers = async () => {
  try {
    console.log('Fetching photographers from Supabase...');
    
    const { data: approvedApps, error } = await supabase
      .from('applications')
      .select('*')
      .eq('status', 'approved');

    if (error) {
      console.error('Error fetching photographers:', error);
      showNotification('Failed to load photographers', 'error');
      return;
    }

    console.log('Found approved applications:', approvedApps);

    if (!approvedApps || approvedApps.length === 0) {
      console.log('No approved applications found');
      setPhotographers([]);
      return;
    }

    const photographersData = approvedApps.map(app => ({
      id: app.user_id,
      name: app.name,
      email: app.email,
      country: app.country || 'Unknown',
      specialization: app.specialization,
      bio: app.bio,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=667eea&color=fff`,
      availability: "available",
      verified: true,
      photoCount: 0, // Will be calculated separately if needed
      followers: 0,
      role: 'photographer'
    }));

    console.log('Setting photographers:', photographersData);
    setPhotographers(photographersData);
  } catch (error) {
    console.error('Error in fetchPhotographers:', error);
    setPhotographers([]);
  }
};

const checkUserPhotographerStatus = async (userId) => {
  try {
    const { data: approvedApp, error } = await supabase
      .from('applications')
      .select('status')
      .eq('user_id', userId)
      .eq('status', 'approved')
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking photographer status:', error);
      return false;
    }

    return !!approvedApp;
  } catch (error) {
    console.error('Error in checkUserPhotographerStatus:', error);
    return false;
  }
};

  // Function to fetch real photos from Supabase
  // Fix the fetchPhotos function
const fetchPhotos = async () => {
  try {
    // Try the original query first
    let { data, error } = await supabase
      .from('photos')
      .select(`
        *,
        profiles!photos_user_id_fkey (name)
      `)
      .eq('approved', true)
      .order('created_at', { ascending: false });

    // If the foreign key relationship doesn't work, fall back to a simpler query
    if (error && error.code === 'PGRST200') {
      console.log('Foreign key relationship not found, using simpler query');
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (photosError) {
        console.error('Error fetching photos:', photosError);
        return;
      }

      // Get user names separately
      const userIds = [...new Set(photosData.map(photo => photo.user_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        data = photosData.map(photo => ({ ...photo, profiles: null }));
      } else {
        data = photosData.map(photo => ({
          ...photo,
          profiles: profiles.find(p => p.id === photo.user_id)
        }));
      }
    } else if (error) {
      console.error('Error fetching photos:', error);
      return;
    }

    const photosData = data.map(photo => ({
      id: photo.id,
      photographerId: photo.user_id,
      photographerName: photo.profiles?.name || 'Unknown',
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
};

// Fix the fetchPhotoReviews function
const fetchPhotoReviews = async () => {
  try {
    // Try the original query first
    let { data, error } = await supabase
      .from('photos')
      .select(`
        *,
        profiles!photos_user_id_fkey (name)
      `)
      .eq('approved', false)
      .order('created_at', { ascending: false });

    // If the foreign key relationship doesn't work, fall back to a simpler query
    if (error && error.code === 'PGRST200') {
      console.log('Foreign key relationship not found, using simpler query for reviews');
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false });

      if (photosError) {
        console.error('Error fetching photo reviews:', photosError);
        return;
      }

      // Get user names separately
      const userIds = [...new Set(photosData.map(photo => photo.user_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles for reviews:', profilesError);
        data = photosData.map(photo => ({ ...photo, profiles: null }));
      } else {
        data = photosData.map(photo => ({
          ...photo,
          profiles: profiles.find(p => p.id === photo.user_id)
        }));
      }
    } else if (error) {
      console.error('Error fetching photo reviews:', error);
      return;
    }

    const reviewsData = data.map(photo => ({
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
};

  // Function to check user role and update if needed
  const checkAndUpdateUserRole = async (user) => {
  if (!user || !user.id) return user;

  try {
    // Check if user has approved photographer application and update role if needed
    const { data: approvedApp, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'approved')
      .maybeSingle();

    if (error) {
      console.error('Error checking user applications:', error);
      return user;
    }

    if (approvedApp && user.role !== 'photographer' && user.role !== 'admin') {
      // User has approved application but role is not photographer - update it
      // But don't override admin role
      const updatedUser = { ...user, role: 'photographer' };
      
      // Update the role in the database as well
      await updateUserRoleInDatabase(user.id, 'photographer');
      
      setCurrentUser(updatedUser);
      return updatedUser;
    }

    return user;
  } catch (error) {
    console.error('Error in checkAndUpdateUserRole:', error);
    return user;
  }
};
  // Function to fetch applications from Supabase
  // Fix the fetchApplications function
const fetchApplications = async () => {
  setIsLoadingApplications(true);
  try {
    console.log('Fetching applications from Supabase...');
    
    // Try to fetch with created_at ordering first
    let { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    // If created_at column doesn't exist, try without ordering
    if (error && error.code === '42703') {
      console.log('created_at column not found, fetching without ordering');
      const result = await supabase
        .from('applications')
        .select('*');
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error fetching applications:', error);
      showNotification('Failed to load applications', 'error');
      return;
    }

    console.log('Raw Supabase data:', data);
    
    // Transform Supabase data to match your local state structure
    const transformedApplications = data.map(app => {
      let images = [];
      
      // Parse images if they exist and are a string
      if (app.images) {
        try {
          images = typeof app.images === 'string' 
            ? JSON.parse(app.images) 
            : app.images;
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
        // Use created_at if it exists, otherwise use current timestamp
        submittedAt: app.created_at || new Date().toISOString()
      };
    });
    
    // Sort by submittedAt in JavaScript if database ordering failed
    transformedApplications.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    console.log('Transformed applications:', transformedApplications);
    setApplications(transformedApplications);
    
  } catch (error) {
    console.error('Error in fetchApplications:', error);
    showNotification('Failed to load applications', 'error');
  } finally {
    setIsLoadingApplications(false);
  }
};

  // Initialize real data from Supabase
  // const initializeData = async () => {
  //   setIsInitializing(true);
  //   try {
  //     // Fetch all data in parallel
  //     await Promise.all([
  //       fetchPhotographers(),
  //       fetchPhotos(),
  //       fetchPhotoReviews(),
  //       fetchApplications()
  //     ]);
  //   } catch (error) {
  //     console.error('Error initializing data:', error);
  //     showNotification('Failed to load application data', 'error');
  //   } finally {
  //     setIsInitializing(false);
  //   }
  // };

  // Function to update user role in database after approval
  const updateUserRoleInDatabase = async (userId, newRole) => {
    try {
      // Update in profiles table if it exists
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user role in database:', error);
      }

      // If the current user is being updated, update their role immediately
      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...currentUser, role: newRole };
        setCurrentUser(updatedUser);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  };

  // Authentication functions
  const login = async (userData) => {
  setIsLoggingIn(true);
  try {
    let userWithCorrectRole = { ...userData };
    
    // If user is not admin, check if they should be photographer
    if (userData.role !== 'admin') {
      const isPhotographer = await checkUserPhotographerStatus(userData.id);
      if (isPhotographer) {
        userWithCorrectRole.role = 'photographer';
        
        // Update role in database if it's not already set
        if (userData.role !== 'photographer') {
          await supabase
            .from('profiles')
            .update({ role: 'photographer' })
            .eq('id', userData.id);
        }
      }
    }
    
    // Set the user with the correct role
    setCurrentUser(userWithCorrectRole);
    localStorage.setItem('currentUser', JSON.stringify(userWithCorrectRole)); // in login

    
    showNotification('Login successful!', 'success');
    setIsLoggingIn(false);
    navigate('/');
    
  } catch (error) {
    console.error('Login error:', error);
    showNotification('Login failed', 'error');
    setIsLoggingIn(false);
  }
};

  const register = async (name, email, password, country) => {
    setIsLoggingIn(true);
    try {
      // Generate a unique ID for the user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Set proper role - new users start as 'user'
      let userRole = 'user';
      
      // Check if registering user is admin (you can customize this logic)
      if (email === 'admin@framelink.com') {
        userRole = 'admin';
      }
      
      const newUser = {
        id: userId,
        name: name,
        email: email,
        role: userRole,
        country: country
      };

      // Give a small delay to ensure state updates properly
      setTimeout(() => {
        setCurrentUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser)); // in register

        showNotification('Registration successful!', 'success');
        setIsLoggingIn(false);
        navigate('/');
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
    showNotification('Logged out successfully!', 'success');
    navigate('/');
    localStorage.removeItem('currentUser');

  };

  // View photographer profile
  const viewPhotographer = (photographerId) => {
    const photographer = photographers.find(p => p.id === photographerId);
    if (!photographer) return;
    setSelectedPhotographer(photographer);
    navigate('/profile');
  };

  // View current user's profile
  const viewMyProfile = () => {
    if (!currentUser) {
      showNotification('Please login to view your profile', 'error');
      return;
    }

    if (currentUser.role === 'photographer') {
      // Find the photographer data
      const photographerData = photographers.find(p => p.id === currentUser.id);
      if (photographerData) {
        setSelectedPhotographer({ ...photographerData, role: 'photographer' });
      } else {
        // Create photographer profile from user data if not found
        const tempPhotographer = {
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
        setSelectedPhotographer(tempPhotographer);
      }
    } else if (currentUser.role === 'admin') {
      // For admin users, create an admin profile
      const adminProfile = {
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
      setSelectedPhotographer(adminProfile);
    } else {
      // For regular users, create a basic profile
      const userProfile = {
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
      setSelectedPhotographer(userProfile);
    }
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
  const approveApplication = async (appId) => {
  try {
    // First, approve the application
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
      // Update user role in profiles table
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'photographer' })
        .eq('id', app.userId);

      if (roleError) {
        console.error('Error updating user role:', roleError);
        // Continue anyway, the application is approved
      }

      // If the current user is the one being approved, update their role immediately
      if (currentUser && currentUser.id === app.userId) {
        setCurrentUser(prev => ({ ...prev, role: 'photographer' }));
      }
      
      showNotification(`${app.name} approved as photographer!`, 'success');
    }
    
    // Refresh both applications and photographers from database
    await Promise.all([
      fetchApplications(),
      fetchPhotographers()
    ]);
    
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
        
        // Refresh applications from database
        await fetchApplications();
      }
    } catch (error) {
      console.error('Error in rejectApplication:', error);
      showNotification('Failed to reject application', 'error');
    }
  };

  const approvePhoto = async (photoId) => {
    try {
      const { error } = await supabase
        .from('photos')
        .update({ approved: true })
        .eq('id', photoId);

      if (error) {
        console.error('Error approving photo:', error);
        showNotification('Failed to approve photo', 'error');
      } else {
        showNotification('Photo approved!', 'success');
        // Refresh photos and reviews
        await fetchPhotos();
        await fetchPhotoReviews();
      }
    } catch (error) {
      console.error('Error in approvePhoto:', error);
      showNotification('Failed to approve photo', 'error');
    }
  };

  const rejectPhoto = async (photoId) => {
    try {
      // You might want to delete rejected photos or mark them as rejected
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

  const handleApplication = async (formData) => {
    if (!currentUser) {
      showNotification('Please login first', 'error');
      return;
    }

    setIsSubmittingApplication(true);
    console.log('Submitting application with currentUser:', currentUser);
    console.log('Form data:', formData);

    try {
      // Prepare the images data
      let imagesData = null;
      
      if (formData.images && formData.images.length > 0) {
        // If user uploaded images, use them
        imagesData = Array.isArray(formData.images) 
          ? JSON.stringify(formData.images)
          : formData.images;
      } else {
        // If no images provided, set to empty array
        imagesData = JSON.stringify([]);
        console.warn('No images provided in application');
      }

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

      console.log('Application data to insert:', applicationData);

      const { data, error } = await supabase
        .from('applications')
        .insert(applicationData)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        showNotification(`Failed to submit application: ${error.message}`, 'error');
        return;
      }

      console.log('Application submitted successfully:', data);
      showNotification('Application submitted! You will be notified once reviewed.', 'success');
      
      // Refresh applications from database to include the new one
      await fetchApplications();
      navigate('/');
      
    } catch (error) {
      console.error('Error in handleApplication:', error);
      showNotification('Failed to submit application.', 'error');
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const handlePhotoUpload = async (caption, imageFile) => {
    try {
      // In a real app, you'd upload the image file to storage first
      // For now, we'll create a placeholder URL
      const photoUrl = "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop";
      
      const { data, error } = await supabase
        .from('photos')
        .insert({
          user_id: currentUser.id,
          url: photoUrl,
          caption: caption,
          approved: false
        })
        .select();

      if (error) {
        console.error('Error uploading photo:', error);
        showNotification('Failed to upload photo', 'error');
      } else {
        showNotification('Photo uploaded and sent for review!', 'success');
        await fetchPhotoReviews();
      }
    } catch (error) {
      console.error('Error in handlePhotoUpload:', error);
      showNotification('Failed to upload photo', 'error');
    }
  };

  const saveAvatarFile = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // In a real app, you would upload this to your server/cloud storage
        // For now, we'll just return the data URL
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  };

  // Updated profile update handler
  const handleProfileUpdate = async (bio, availability, avatarFile, removeAvatar) => {
    setIsUpdatingProfile(true);
    try {
      let newAvatarUrl = selectedPhotographer?.avatar;

      if (removeAvatar) {
        // User wants to remove avatar
        newAvatarUrl = '';
      } else if (avatarFile) {
        // User uploaded a new avatar
        newAvatarUrl = await saveAvatarFile(avatarFile);
      }

      // Update in photographers array
      setPhotographers(prev => prev.map(p => 
        p.id === currentUser.id ? { 
          ...p, 
          bio, 
          availability,
          avatar: newAvatarUrl
        } : p
      ));
      
      // Also update selectedPhotographer if it's the current user's profile
      if (selectedPhotographer && selectedPhotographer.id === currentUser.id) {
        setSelectedPhotographer(prev => ({ 
          ...prev, 
          bio, 
          availability,
          avatar: newAvatarUrl
        }));
      }
      
      showNotification('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('Failed to update profile', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Initialize on mount
  // useEffect(() => {
  //   // initializeData();
  // }, []);
  useEffect(() => {
  fetchPhotographers();
  fetchPhotos();
}, []);


  // Check user role when currentUser changes
  useEffect(() => {
  // Only load admin data when admin logs in, and only once
  if (currentUser?.role === 'admin') {
    const loadAdminData = async () => {
      try {
        await Promise.all([
          fetchPhotographers(),
          fetchPhotos(),
          fetchPhotoReviews(),
          fetchApplications()
        ]);
      } catch (error) {
        console.error('Error loading admin data:', error);
        showNotification('Some admin data failed to load', 'error');
      }
    };
    
    loadAdminData();
  }
}, [currentUser?.id]);

  // Generate user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Generate avatar URL with user initials
  const getUserAvatar = (user) => {
    if (!user) return '';
    const initials = getUserInitials(user.name);
    let backgroundColor = '6b7280'; // Default gray
    
    if (user.role === 'admin') {
      backgroundColor = 'dc2626'; // Red for admin
    } else if (user.role === 'photographer') {
      backgroundColor = '667eea'; // Blue for photographer
    }
    
    return `https://ui-avatars.com/api/?name=${initials}&background=${backgroundColor}&color=fff&size=40`;
  };

  // Header component
  const Header = () => (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Framelink</div>
          <div className="nav-links">
            <span className="nav-link nav-link-underline" onClick={() => navigate('/directory')}>Photographers</span>
            {!currentUser ? (
              <div id="nav-auth">
                <span className="nav-link nav-link-underline" onClick={() => navigate('/login')}>Login</span>
                <span className="nav-link nav-link-underline" onClick={() => navigate('/register')}>Sign Up</span>
              </div>
            ) : (
              <div id="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
  <span className="nav-link nav-link-underline" onClick={viewMyProfile}>
    <img 
      src={getUserAvatar(currentUser)} 
      alt="Profile" 
      style={{ 
        width: '32px', 
        height: '32px', 
        borderRadius: '50%', 
        marginRight: '8px',
        verticalAlign: 'middle'
      }} 
    />
    My Profile
  </span>
  {/* Only show "Become Photographer" for regular users, not admin */}
  {currentUser.role === 'user' && (
    <span className="nav-link nav-link-underline" onClick={() => navigate('/apply')}>Become Photographer</span>
  )}
  {currentUser.role === 'photographer' && (
    <span className="nav-link nav-link-underline" onClick={() => navigate('/dashboard')}>Dashboard</span>
  )}
  {/* Admin section - always show for admin */}
  {currentUser.role === 'admin' && (
    <span className="nav-link nav-link-underline" onClick={() => navigate('/admin')}>Admin Panel</span>
  )}
  <span className="nav-link nav-link-underline" onClick={logout}>Logout</span>
</div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );

  // Show full page loading during initialization
  // if (isInitializing) {
  //   return <FullPageLoading message="Initializing Framelink..." />;
  // }

  // Show login loading overlay
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
              currentUser={currentUser}
              isOwnProfile={selectedPhotographer?.id === currentUser?.id}
              onProfileUpdate={handleProfileUpdate}
              isUpdatingProfile={isUpdatingProfile}
            />} />
            <Route path="/apply" element={<Apply 
              onSubmitApplication={handleApplication}
              isSubmitting={isSubmittingApplication}
            />} />
            <Route path="/dashboard" element={<Dashboard 
              currentUser={currentUser}
              onPhotoUpload={handlePhotoUpload}
              onProfileUpdate={handleProfileUpdate}
              isUpdatingProfile={isUpdatingProfile}
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