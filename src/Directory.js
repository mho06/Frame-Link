import React, { useState } from 'react';
import { Search, MapPin, Camera, Users, Star, Filter } from 'lucide-react';

const Directory = ({ photographers, onViewPhotographer, onContactPhotographer, currentUser, showNotification }) => {
  const [photographerFilters, setPhotographerFilters] = useState({
    country: '',
    category: '',
    availability: '',
    search: ''
  });

  const filterPhotographers = () => {
    return photographers.filter(p => {
      const matchesCountry = photographerFilters.country === '' || p.country === photographerFilters.country;
      const matchesCategory = photographerFilters.category === '' || p.specialization === photographerFilters.category;
      const matchesAvailability = photographerFilters.availability === '' || p.availability === photographerFilters.availability;
      const matchesSearch = photographerFilters.search === '' || 
        p.name.toLowerCase().includes(photographerFilters.search.toLowerCase()) ||
        p.bio.toLowerCase().includes(photographerFilters.search.toLowerCase()) ||
        p.specialization.toLowerCase().includes(photographerFilters.search.toLowerCase());
      
      return p.verified && matchesCountry && matchesCategory && matchesAvailability && matchesSearch;
    });
  };
  const countryMap = {
  US: 'United States',
  CA: 'Canada',
  GB: 'United Kingdom',
  AU: 'Australia',
  DE: 'Germany',
  FR: 'France',
  JP: 'Japan'
  // Add more as needed...
};

const getCountryName = (code) => countryMap[code?.toUpperCase()] || code || 'Unknown';


  const handleContact = (photographerId) => {
    if (!currentUser) {
      showNotification('Please login to contact photographers', 'error');
      return;
    }
    onContactPhotographer(photographerId);
  };

  const filteredPhotographers = filterPhotographers();

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#FF6F61',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Main Content Container */}
      <div style={{
        background: '#FFFFFF',
        minHeight: 'calc(100vh - 2rem)',
        borderRadius: '1.5rem 1.5rem 0 0',
        marginTop: '2rem',
        overflow: 'hidden'
      }}>
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
          padding: '4rem 1rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            color: '#1A1A1A',
            marginBottom: '1rem',
            letterSpacing: '-0.025em',
            lineHeight: '1.1'
          }}>
            Find Amazing Photographers
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#666666',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Discover talented photographers from around the world. Connect with professionals who match your vision.
          </p>
        </div>

        {/* Filters Section */}
        <div style={{
          padding: '2rem',
          background: '#F9FAFB',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            justifyContent: 'center'
          }}>
            <Filter size={20} style={{ color: '#FF6F61' }} />
            <span style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1A1A1A'
            }}>
              Filters
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '200px' }}>
              <Search 
                size={16} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666666'
                }}
              />
              <input
                type="text"
                placeholder="Search photographers..."
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  background: '#FFFFFF',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                value={photographerFilters.search}
                onChange={(e) => setPhotographerFilters(prev => ({ ...prev, search: e.target.value }))}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF6F61';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 111, 97, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Country Filter */}
            <div style={{ position: 'relative', minWidth: '150px' }}>
              <MapPin 
                size={16} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666666',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />
              <select 
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  background: '#FFFFFF',
                  appearance: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                value={photographerFilters.country}
                onChange={(e) => setPhotographerFilters(prev => ({ ...prev, country: e.target.value }))}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF6F61';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 111, 97, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
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
            </div>
            
            {/* Category Filter */}
            <div style={{ position: 'relative', minWidth: '150px' }}>
              <Camera 
                size={16} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666666',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />
              <select 
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  background: '#FFFFFF',
                  appearance: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                value={photographerFilters.category}
                onChange={(e) => setPhotographerFilters(prev => ({ ...prev, category: e.target.value }))}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF6F61';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 111, 97, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
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
            </div>
            
            {/* Availability Filter */}
            <div style={{ position: 'relative', minWidth: '150px' }}>
              <Users 
                size={16} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666666',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />
              <select 
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  background: '#FFFFFF',
                  appearance: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                value={photographerFilters.availability}
                onChange={(e) => setPhotographerFilters(prev => ({ ...prev, availability: e.target.value }))}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF6F61';
                  e.target.style.boxShadow = '0 0 0 3px rgba(255, 111, 97, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">All Availability</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem'
        }}>
          {/* Results Count */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{
              color: '#666666',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Showing {filteredPhotographers.length} photographer{filteredPhotographers.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Loading State */}
          {photographers.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4rem 0',
              textAlign: 'center'
            }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                border: '3px solid #E5E7EB',
                borderTop: '3px solid #FF6F61',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
              }}></div>
              <p style={{
                color: '#666666',
                fontSize: '1.125rem'
              }}>
                Loading photographers...
              </p>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
            </div>
          ) : (
            <>
              {/* Photographers Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '2rem'
              }}>
                {filteredPhotographers.map((photographer) => (
                  <div 
                    key={photographer.id} 
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '1rem',
                      padding: '2rem',
                      textAlign: 'center',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      border: '1px solid #F3F4F6'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
                    }}
                  >
                    {/* Avatar and Basic Info */}
                    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                      <img 
                        src={photographer.avatar} 
                        alt={photographer.name} 
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          margin: '0 auto 1rem',
                          border: '3px solid #F3F4F6'
                        }}
                        loading="lazy"
                      />
                      {photographer.verified && (
                        <div style={{
                          position: 'absolute',
                          top: '0',
                          right: '50%',
                          transform: 'translateX(50px)',
                          background: '#FF6F61',
                          color: '#FFFFFF',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px'
                        }}>
                          <Star size={12} fill="currentColor" />
                        </div>
                      )}
                      <div style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '50%',
                        transform: 'translateX(50px)',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid #FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: photographer.availability === 'available' ? '#10B981' : '#F59E0B',
                        color: '#FFFFFF'
                      }}>
                        {photographer.availability === 'available' ? '✓' : '⏳'}
                      </div>
                    </div>

                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#1A1A1A'
                    }}>
                      {photographer.name}
                    </h3>
                    
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#FF6F61',
                      fontWeight: '600',
                      marginBottom: '0.5rem'
                    }}>
                      {photographer.specialization}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.25rem',
                      marginBottom: '1rem',
                      color: '#666666',
                      fontSize: '0.875rem'
                    }}>
                      <MapPin size={14} />
                      <span>{getCountryName(photographer.country)}</span>


                    </div>
                    
                    <p style={{
                      color: '#666666',
                      fontSize: '0.875rem',
                      marginBottom: '1.5rem',
                      lineHeight: '1.5',
                      maxHeight: '4.5rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {photographer.bio}
                    </p>
                    
                    {/* Stats */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      marginBottom: '1.5rem',
                      padding: '1rem 0',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '0.5rem'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: '1.25rem',
                          fontWeight: '700',
                          color: '#FF6F61',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem'
                        }}>
                          <Camera size={16} />
                          {photographer.photoCount}
                        </div>
                        <div style={{
                          color: '#666666',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          Photos
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: '1.25rem',
                          fontWeight: '700',
                          color: '#FF6F61',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem'
                        }}>
                          <Users size={16} />
                          {photographer.followers}
                        </div>
                        <div style={{
                          color: '#666666',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          Followers
                        </div>
                      </div>
                    </div>
                    
                    {/* Availability Badge */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '1.5rem',
                      background: photographer.availability === 'available' ? '#10B981' : '#F59E0B',
                      color: '#FFFFFF'
                    }}>
                      {photographer.availability === 'available' ? 'Available' : 'Busy'}
                    </div>
                    
                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '0.75rem',
                      justifyContent: 'center'
                    }}>
                      <button 
                        style={{
                          padding: '0.75rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          borderRadius: '9999px',
                          border: '2px solid #FF6F61',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          whiteSpace: 'nowrap',
                          background: 'transparent',
                          color: '#FF6F61',
                          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                        }}
                        onClick={() => onViewPhotographer(photographer.id)}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#FF6F61';
                          e.target.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#FF6F61';
                        }}
                      >
                        View Profile
                      </button>
                      <button 
                        style={{
                          padding: '0.75rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          borderRadius: '9999px',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          whiteSpace: 'nowrap',
                          background: '#FF6F61',
                          color: '#FFFFFF',
                          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                        }}
                        onClick={() => handleContact(photographer.id)}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#E55B4D';
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#FF6F61';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* No Results State */}
              {filteredPhotographers.length === 0 && photographers.length > 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '4rem 0'
                }}>
                  <div style={{
                    width: '96px',
                    height: '96px',
                    background: '#F3F4F6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <Search size={32} style={{ color: '#666666' }} />
                  </div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#1A1A1A',
                    marginBottom: '0.5rem'
                  }}>
                    No photographers found
                  </h3>
                  <p style={{
                    color: '#666666',
                    marginBottom: '1.5rem',
                    fontSize: '0.875rem'
                  }}>
                    Try adjusting your filters or search terms to see more results.
                  </p>
                  <button 
                    style={{
                      padding: '0.75rem 1.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      borderRadius: '9999px',
                      border: '2px solid #FF6F61',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: 'transparent',
                      color: '#FF6F61',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    }}
                    onClick={() => setPhotographerFilters({ country: '', category: '', availability: '', search: '' })}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#FF6F61';
                      e.target.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#FF6F61';
                    }}
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Directory;