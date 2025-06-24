import React, { useState } from 'react';

const Directory = ({ photographers, onViewPhotographer, onContactPhotographer, currentUser, showNotification }) => {
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

  const handleContact = (photographerId) => {
    if (!currentUser) {
      showNotification('Please login to contact photographers', 'error');
      return;
    }
    onContactPhotographer(photographerId);
  };

  return (
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
              <button className="btn btn-secondary" onClick={() => onViewPhotographer(photographer.id)}>View Profile</button>
              <button className="btn btn-primary" onClick={() => handleContact(photographer.id)}>Contact</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Directory;