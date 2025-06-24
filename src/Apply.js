import React, { useState } from 'react';

const Apply = ({ onSubmitApplication }) => {
  const [formData, setFormData] = useState({
    experience: '',
    specialization: '',
    portfolio: '',
    bio: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitApplication(formData);
    // Reset form
    setFormData({
      experience: '',
      specialization: '',
      portfolio: '',
      bio: ''
    });
  };

  return (
    <div className="page">
      <div className="form-container" style={{ maxWidth: '600px' }}>
        <h2 className="text-center mb-2">Become a Verified Photographer</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="app-experience">Years of Experience</label>
            <select 
              name="experience" 
              id="app-experience" 
              value={formData.experience}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Experience Level</option>
              <option value="1-2">1-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="app-specialization">Specialization</label>
            <select 
              name="specialization" 
              id="app-specialization" 
              value={formData.specialization}
              onChange={handleInputChange}
              required
            >
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
            <input 
              type="url" 
              name="portfolio" 
              id="app-portfolio" 
              value={formData.portfolio}
              onChange={handleInputChange}
              placeholder="https://yourportfolio.com" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="app-bio">Professional Bio</label>
            <textarea 
              name="bio" 
              id="app-bio" 
              rows="4" 
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about your photography journey and style..." 
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="app-samples">Sample Photos (Upload 3-5 best works)</label>
            <input type="file" id="app-samples" multiple accept="image/*" required />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default Apply;