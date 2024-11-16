import React, { useState } from 'react';
import uploadcare from 'uploadcare-widget';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [carName, setCarName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [title, setTitle] = useState('');
  const [carType, setCarType] = useState('');
  const [company, setCompany] = useState('');
  const [dealer, setDealer] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const UPLOADCARE_PUBLIC_KEY = 'bf39c083403d4ee12f92';
  const handleUpload = (type) => {
    const dialog = uploadcare.openDialog(null, {
      publicKey: UPLOADCARE_PUBLIC_KEY,
      multiple: type === 'images',
      multipleMin: 1,
     multipleMax: 10,
    });

    dialog.fail(function(error, fileInfo) {
      alert('Upload fialed');
   });

    dialog.done((fileGroup) => {

      fileGroup.promise().then((files) => {
        
        if (type === 'logo') {
         
          setLogoUrl(files.cdnUrl);
         
        } 
        else if (type === 'images') 
          {
           const count=files.count
          let base_url=files.cdnUrl
          let urls = Array.from({ length: count }, () => base_url);
          for(let i=0;i<count;i++){
                urls[i]+=`nth/${i}/`;
          }
          console.log(urls)
         
          setImages(urls);
        }
      });
    });
  };
  
  async function createNewCar(ev) {
    ev.preventDefault();
  
    const accessToken = localStorage.getItem('access_token');
  
    if (!accessToken) {
      alert('You must be logged in to create a car.');
      return;
    }
  
    const carData = {
      car_name: carName,
      title,
      description,
      tags,
      car_type: carType,
      company,
      dealer,
      logo_url: logoUrl,
      images: images.length > 0 ? images : [],
    };
  
 
  
    const response = await fetch('https://carsholic.vercel.app/api/cars/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(carData),
    });
  
    if (response.ok) {
      navigate('/');
    } else {
      console.error('Failed to add car');
    }
  }

  return (
    <form onSubmit={createNewCar} className="create-car-form">
      <h1>Create a New Car</h1>

      <input
        type="text"
        placeholder="Car Name"
        value={carName}
        onChange={(e) => setCarName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Car Type (e.g., Sedan, SUV)"
        value={carType}
        onChange={(e) => setCarType(e.target.value)}
      />
      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <input
        type="text"
        placeholder="Dealer"
        value={dealer}
        onChange={(e) => setDealer(e.target.value)}
      />

      <h2>Upload Logo</h2>
      <button type="button" onClick={() => handleUpload('logo')}>
        Upload Logo
      </button>
      {logoUrl && <p>Logo Uploaded: <a href={logoUrl} target="_blank" rel="noopener noreferrer">{logoUrl}</a></p>}

      <h2>Upload Images</h2>
      <button type="button" onClick={() => handleUpload('images')}>
        Upload Images
      </button>
      {images.length > 0 && (
        <div>
          {images.map((imageUrl, index) => (
            <p key={index}>
              Image Uploaded: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a>
            </p>
          ))}
        </div>
      )}

      <button type="submit">Add Car</button>
    </form>
  );
}
