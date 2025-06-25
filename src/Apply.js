import React, { useState } from 'react';

const Apply = ({ onSubmitApplication }) => {
  const [formData, setFormData] = useState({
    experience: '',
    specialization: '',
    portfolio: '',
    bio: '',
    images: []
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      alert('Please select maximum 5 images');
      e.target.value = '';
      return;
    }

    if (files.length < 3) {
      alert('Please select at least 3 images');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setImageFiles(files);

    try {
      // Convert files to base64 or data URLs for storage
      const imagePromises = files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      });

      const imageDataUrls = await Promise.all(imagePromises);
      
      setFormData(prev => ({
        ...prev,
        images: imageDataUrls
      }));

      console.log('Images processed:', imageDataUrls.length);
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Error processing images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newFiles = imageFiles.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
    setImageFiles(newFiles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.images.length < 3) {
      alert('Please upload at least 3 sample photos');
      return;
    }

    console.log('Submitting form data with images:', formData);
    onSubmitApplication(formData);
    
    // Reset form
    setFormData({
      experience: '',
      specialization: '',
      portfolio: '',
      bio: '',
      images: []
    });
    setImageFiles([]);
    
    // Reset file input
    const fileInput = document.getElementById('app-samples');
    if (fileInput) fileInput.value = '';
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
            <input 
              type="file" 
              id="app-samples" 
              multiple 
              accept="image/*" 
              required 
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {isUploading && (
              <div style={{ marginTop: '10px', color: '#666' }}>
                Processing images...
              </div>
            )}
          </div>

          {/* Image Preview */}
          {formData.images.length > 0 && (
            <div className="form-group">
              <label>Selected Images ({formData.images.length})</label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                gap: '10px',
                marginTop: '10px'
              }}>
                {formData.images.map((image, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img 
                      src={image} 
                      alt={`Sample ${index + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '100px', 
                        objectFit: 'cover', 
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'rgba(255, 0, 0, 0.7)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={isUploading}
          >
            {isUploading ? 'Processing Images...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Apply;