import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, X, Send, User, Calendar, Eye } from 'lucide-react';
import supabase from './supabase';
import './HomePage.css';

const HomePage = ({ photos, currentUser, onLikePhoto, onCommentPhoto, onViewPhotographer }) => {
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState({});
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState(new Set());
  const [photoLikes, setPhotoLikes] = useState({});

  // Debug logging
  useEffect(() => {
    console.log('HomePage - currentUser:', currentUser);
    console.log('HomePage - photos:', photos);
  }, [currentUser, photos]);

  // Initialize liked photos and photo likes for current user
  useEffect(() => {
    const initializeLikes = async () => {
      if (currentUser && photos?.length > 0) {
        try {
          // Fetch user's liked photos from Supabase
          const { data: likesData, error: likesError } = await supabase
            .from('likes')
            .select('photo_id')
            .eq('user_id', currentUser.id);

          if (likesError) {
            console.error('Error fetching likes:', likesError);
            return;
          }

          const userLikedPhotos = new Set(likesData.map(like => like.photo_id));
          setLikedPhotos(userLikedPhotos);

          // Fetch total likes count for each photo
          const photoIds = photos.map(p => p.id);
          const { data: allLikesData, error: countError } = await supabase
            .from('likes')
            .select('photo_id')
            .in('photo_id', photoIds);

          if (countError) {
            console.error('Error fetching likes count:', countError);
            return;
          }

          // Count likes per photo
          const likesCount = {};
          photoIds.forEach(id => {
            likesCount[id] = allLikesData.filter(like => like.photo_id === id).length;
          });
          setPhotoLikes(likesCount);

          console.log('Initialized likes:', { userLikedPhotos, likesCount });
        } catch (error) {
          console.error('Error initializing likes:', error);
        }
      } else {
        setLikedPhotos(new Set());
        setPhotoLikes({});
      }
    };

    initializeLikes();
  }, [currentUser, photos]);

  // Fetch comments from Supabase
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id, 
          photo_id, 
          comment, 
          created_at,
          profiles!comments_user_id_fkey (
            id,
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Error loading comments:', error);
        return;
      }

      const grouped = data.reduce((acc, c) => {
        const pid = c.photo_id;
        if (!acc[pid]) acc[pid] = [];
        
        // Get user name with fallbacks
        let userName = 'Anonymous User';
        if (c.profiles) {
          userName = c.profiles.full_name || 
                    (c.profiles.email ? c.profiles.email.split('@')[0] : 'Anonymous User');
        }

        acc[pid].push({
          id: c.id,
          user: userName,
          comment: c.comment,
          timestamp: new Date(c.created_at).toLocaleString(),
        });
        return acc;
      }, {});

      setComments(grouped);
      console.log('Comments loaded:', grouped);
    } catch (error) {
      console.error('Error in fetchComments:', error);
    }
  };

  // Load comments on component mount and when photos change
  useEffect(() => {
    if (photos?.length > 0) {
      fetchComments();
    }
  }, [photos]);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setNewComment(''); // Reset comment when opening modal
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setNewComment('');
    document.body.style.overflow = 'unset';
  };

  const handleLike = async (photoId) => {
    console.log('handleLike called:', { photoId, currentUser, hasCurrentUser: !!currentUser });
    
    if (!currentUser) {
      console.log('No current user, showing alert');
      alert('Please login to like photos');
      return;
    }
    
    const isCurrentlyLiked = likedPhotos.has(photoId);
    
    try {
      if (isCurrentlyLiked) {
        // Unlike the photo
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('photo_id', photoId);

        if (error) {
          console.error('Error unliking photo:', error);
          alert(`Failed to unlike photo: ${error.message}`);
          return;
        }

        // Update local state only after successful database operation
        const newLikedPhotos = new Set(likedPhotos);
        newLikedPhotos.delete(photoId);
        setLikedPhotos(newLikedPhotos);
        
        setPhotoLikes(prev => ({
          ...prev,
          [photoId]: Math.max(0, (prev[photoId] || 0) - 1)
        }));

        console.log('Photo unliked successfully');
      } else {
        // Like the photo
        const { error } = await supabase
          .from('likes')
          .insert([{
            user_id: currentUser.id,
            photo_id: photoId
          }]);

        if (error) {
          console.error('Error liking photo:', error);
          // Check if it's a duplicate key error (user already liked)
          if (error.code === '23505') {
            alert('You have already liked this photo');
            // Refresh the liked photos state
            const { data: likesData } = await supabase
              .from('likes')
              .select('photo_id')
              .eq('user_id', currentUser.id);
            
            if (likesData) {
              setLikedPhotos(new Set(likesData.map(like => like.photo_id)));
            }
          } else {
            alert(`Failed to like photo: ${error.message}`);
          }
          return;
        }

        // Update local state only after successful database operation
        const newLikedPhotos = new Set(likedPhotos);
        newLikedPhotos.add(photoId);
        setLikedPhotos(newLikedPhotos);
        
        setPhotoLikes(prev => ({
          ...prev,
          [photoId]: (prev[photoId] || 0) + 1
        }));

        console.log('Photo liked successfully');
      }

      // Call parent callback if provided
      if (onLikePhoto) {
        await onLikePhoto(photoId, !isCurrentlyLiked);
      }
    } catch (error) {
      console.error('Error in handleLike:', error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please login to comment');
      return;
    }

    const commentText = newComment.trim();
    if (!commentText) return;

    setIsSubmittingComment(true);

    try {
      console.log('Attempting to insert comment with:', {
        photo_id: selectedPhoto.id,
        user_id: currentUser.id,
        comment: commentText
      });

      const { data, error } = await supabase
        .from('comments')
        .insert([{
          photo_id: selectedPhoto.id,
          user_id: currentUser.id,
          comment: commentText
        }])
        .select(`
          id, 
          photo_id, 
          comment, 
          created_at,
          profiles!comments_user_id_fkey (
            id,
            full_name,
            email
          )
        `);

      if (error) {
        console.error('Error inserting comment:', error);
        alert(`Failed to submit comment: ${error.message}`);
        return;
      }

      console.log('Comment inserted successfully:', data);

      // Update local comments state
      if (data && data.length > 0) {
        const newCommentData = data[0];
        let userName = 'Anonymous User';
        if (newCommentData.profiles) {
          userName = newCommentData.profiles.full_name || 
                    (newCommentData.profiles.email ? newCommentData.profiles.email.split('@')[0] : 'Anonymous User');
        }

        const formattedComment = {
          id: newCommentData.id,
          user: userName,
          comment: newCommentData.comment,
          timestamp: new Date(newCommentData.created_at).toLocaleString(),
        };

        setComments(prev => ({
          ...prev,
          [selectedPhoto.id]: [...(prev[selectedPhoto.id] || []), formattedComment]
        }));

        // Clear the input
        setNewComment('');

        // Call parent callback if provided
        if (onCommentPhoto) {
          await onCommentPhoto(selectedPhoto.id, commentText);
        }
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert(`Failed to submit comment: ${error.message}`);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handlePhotographerClick = (photo) => {
    if (onViewPhotographer) {
      onViewPhotographer(photo.photographerId || photo.userId);
    } else {
      navigate(`/photographer/${photo.photographerId || photo.userId}`);
    }
  };

  const getPhotographerName = (photo) => {
    return photo.photographerName || 'Unknown Photographer';
  };

  // Enhanced photo grid with better interactions
  const PhotoGrid = () => (
    <div className="photo-grid">
      {photos.filter(photo => photo.approved !== false).map((photo) => (
        <div 
          className="photo-card enhanced-photo-card" 
          key={photo.id}
          onClick={() => handlePhotoClick(photo)}
        >
          <div className="photo-container">
            <img src={photo.url} alt={photo.caption || 'Photo'} loading="lazy" />
            <div className="photo-overlay">
              <div className="photo-stats">
                <div className="stat">
                  <Heart size={16} fill={likedPhotos.has(photo.id) ? "#ff4757" : "white"} />
                  <span>{photoLikes[photo.id] || photo.likes || 0}</span>
                </div>
                <div className="stat">
                  <MessageCircle size={16} fill="white" />
                  <span>{comments[photo.id]?.length || 0}</span>
                </div>
                <div className="stat">
                  <Eye size={16} fill="white" />
                  <span>View</span>
                </div>
              </div>
            </div>
          </div>
          <div className="photo-info">
            <h3>{photo.caption || 'Untitled'}</h3>
            <div 
              className="photographer-info"
              onClick={(e) => {
                e.stopPropagation();
                handlePhotographerClick(photo);
              }}
            >
              <span className="photographer-name">{getPhotographerName(photo)}</span>
              <span className="verified-badge">✓ Verified</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Photo Modal Component
  const PhotoModal = () => {
    if (!selectedPhoto) return null;

    const photoComments = comments[selectedPhoto.id] || [];
    const isLiked = likedPhotos.has(selectedPhoto.id);
    const photographerName = getPhotographerName(selectedPhoto);
    const likesCount = photoLikes[selectedPhoto.id] || selectedPhoto.likes || 0;

    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="photo-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={closeModal}>
            <X size={24} />
          </button>
          
          <div className="modal-content">
            <div className="modal-image-section">
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.caption || 'Photo'}
                className="modal-image"
              />
            </div>
            
            <div className="modal-info-section">
              <div className="modal-header">
                <div 
                  className="photographer-profile"
                  onClick={() => handlePhotographerClick(selectedPhoto)}
                >
                  <div className="photographer-avatar">
                    {selectedPhoto.photographer?.avatar ? (
                      <img src={selectedPhoto.photographer.avatar} alt="Avatar" />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div>
                    <h3>{photographerName}</h3>
                    <span className="verified-badge-small">✓ Verified Photographer</span>
                  </div>
                </div>
                <div className="photo-date">
                  <Calendar size={16} />
                  <span>{new Date(selectedPhoto.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="modal-caption">
                <p>{selectedPhoto.caption || 'No caption provided'}</p>
              </div>

              <div className="modal-actions">
                <button 
                  className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(selectedPhoto.id)}
                  disabled={!currentUser}
                >
                  <Heart size={20} fill={isLiked ? '#ff4757' : 'none'} />
                  <span>{likesCount} likes</span>
                </button>
                <button className="action-btn comment-btn">
                  <MessageCircle size={20} />
                  <span>{photoComments.length} comments</span>
                </button>
              </div>

              <div className="comments-section">
                <div className="comments-list">
                  {photoComments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <div className="comment-avatar">
                        <User size={16} />
                      </div>
                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="comment-user">{comment.user}</span>
                          <span className="comment-time">{comment.timestamp}</span>
                        </div>
                        <p className="comment-text">{comment.comment}</p>
                      </div>
                    </div>
                  ))}
                  {photoComments.length === 0 && (
                    <div className="no-comments">
                      <p>No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>

                {currentUser ? (
                  <form className="comment-form" onSubmit={handleCommentSubmit}>
                    <div className="comment-input-container">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="comment-input"
                        disabled={isSubmittingComment}
                      />
                      <button 
                        type="submit" 
                        className="comment-submit"
                        disabled={!newComment.trim() || isSubmittingComment}
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="login-prompt">
                    <p>
                      <span onClick={() => navigate('/login')} className="login-link">
                        Login
                      </span> to like and comment on photos
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page">
      <div className="hero">
        <h1>Discover Amazing Photography</h1>
        <p>Connect with talented photographers worldwide and explore stunning visual stories</p>
        <div className="hero-buttons">
          {!currentUser ? (
            <>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>
                Join FrameLink
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/login')}>
                Login
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={() => navigate('/upload')}>
                Upload Photo
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/directory')}>
                Browse Photographers
              </button>
            </>
          )}
        </div>
      </div>

      <div className="featured-section">
        <h2>Featured Photos</h2>
        <p>Discover the latest work from our talented community</p>
        {photos && photos.length > 0 ? (
          <PhotoGrid />
        ) : (
          <div className="no-photos">
            <p>No photos available at the moment. Check back later!</p>
          </div>
        )}
      </div>

      <PhotoModal />
    </div>
  );
};

export default HomePage;