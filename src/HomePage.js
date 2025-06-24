import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ photos }) => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="hero">
        <h1>Discover Amazing Photography</h1>
        <p>Connect with talented photographers worldwide and explore stunning visual stories</p>
        <div className="flex justify-center gap-1 mt-2" style={{ display: 'flex', justifyContent: 'center' }}>
          <span className="btn btn-primary" onClick={() => navigate('/register')}>Join FrameLink</span>
          <span className="btn btn-secondary" onClick={() => navigate('/directory')}>Browse Photographers</span>
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
  );
};

export default HomePage;