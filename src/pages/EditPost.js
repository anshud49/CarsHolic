import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import uploadcare from 'uploadcare-widget';

export default function EditPost() {
  const [car, setCar] = useState(null);
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
  const { id } = useParams(); 

  const UPLOADCARE_PUBLIC_KEY = 'bf39c083403d4ee12f92';
  const MAX_IMAGES = 10;

  useEffect(() => {
    const fetchCarDetails = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`https://carsholic.vercel.app/api/cars/${id}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCar(data);
          setCarName(data.car_name);
          setDescription(data.description);
          setTags(data.tags);
          setTitle(data.title);
          setCarType(data.car_type);
          setCompany(data.company);
          setDealer(data.dealer);
          setLogoUrl(data.logo_url);
          setImages(data.images);
        } else {
          console.error('Failed to fetch car details');
        }
      } catch (error) {
        console.error('Error fetching car:', error);
        navigate('/login');
      }
    };

    fetchCarDetails();
  }, [id, navigate]);

  const handleUpload = (type) => {
    const dialog = uploadcare.openDialog(null, {
      publicKey: UPLOADCARE_PUBLIC_KEY,
      multiple: type === 'images',
      multipleMin: 1,
      multipleMax: MAX_IMAGES - images.length,
    });

    dialog.fail(function (error) {
      alert('Upload failed');
    });

    dialog.done((fileGroup) => {
      fileGroup.promise().then((files) => {
        if (type === 'logo') {
          setLogoUrl(files.cdnUrl);
        } else if (type === 'images') {
          const count = files.count;
          const base_url = files.cdnUrl;
          const urls = Array.from({ length: count }, (_, i) => `${base_url}nth/${i}/`);

          setImages((prevImages) => [
            ...prevImages,
            ...urls.map((url) => ({ image_url: url })),
          ]);
        }
      });
    });
  };

  const handleDeleteImage = async (imageId) => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      alert('You must be logged in to delete an image.');
      return;
    }

    try {
      const response = await fetch(`https://carsholic.vercel.app/api/carimages/${imageId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setImages((prevImages) => prevImages.filter((image) => image.id !== imageId));
      } else {
        console.error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleUpdateCar = async (ev) => {
    ev.preventDefault();

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      alert('You must be logged in to update a car.');
      return;
    }

    const updatedCarData = {
      car_name: carName,
      title,
      description,
      tags,
      car_type: carType,
      company,
      dealer,
      logo_url: logoUrl,
      images: images.length > 0 ? images.map((image) => image.image_url) : [],
    };

    try {
      const response = await fetch(`https://carsholic.vercel.app/api/cars/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedCarData),
      });

      if (response.ok) {
        navigate(`/post/${id}`);
      } else {
        console.error('Failed to update car');
      }
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };

  if (!car) return <p>Loading...</p>;

  const remainingImages = MAX_IMAGES - images.length;

  return (
    <form onSubmit={handleUpdateCar} className="create-car-form">
      <h1>Edit Car</h1>

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
      <button
        type="button"
        onClick={() => handleUpload('images')}
        disabled={remainingImages === 0}
      >
        Upload Images
      </button>
      <p>{remainingImages} more images can be uploaded.</p>
      {images.length > 0 && (
        <div>
          {images.map((image, index) => (
            <div key={index}>
              <p>
                Image Uploaded: <a href={image.image_url} target="_blank" rel="noopener noreferrer">{image.image_url}</a>
                <button type="button" onClick={() => handleDeleteImage(image.id)}>Delete</button>
              </p>
            </div>
          ))}
        </div>
      )}

      <button type="submit">Update Car</button>
    </form>
  );
}
