import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'

export default function PostPage() {
  const [cars, setCars] = useState([]);
  const [display, setDisplay] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      const accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://carsholic.vercel.app/api/cars/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.status === 401) {
          navigate('/login'); 
          return;
        }

        const carData = await response.json();
        setCars(carData);
        setDisplay(carData);
        
      } catch (error) {
        console.error('Error fetching cars:', error);
        navigate('/login'); 
      }
    };

    fetchCars();
  }, [navigate]);

  const [search, setSearch] = useState('');

  const handleDelete = async (carId) => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`https://carsholic.vercel.app/api/cars/${carId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
      
        setCars(cars.filter(car => car.id !== carId));
        setDisplay(display.filter(car => car.id !== carId));
      } else {
        console.error('Error deleting car');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  if (!cars.length) return <p>Loading...</p>;

  return (
    <div className="car-page">
      <input
        type="text"
        placeholder="Search"
        onChange={(e) => {
      setSearch(e.target.value);
          if (!e.target.value) {
            setDisplay(cars);
          } else {
            setDisplay(cars.filter(car =>
              car.description.includes(search) ||
              car.title.includes(search) ||
              car.tags.includes(search)
            ));
          }
        }}
      />

      {display.map((car) => (
        <div key={car.id} className="car">
          <div className="car-logo">
            <img src={car.logo_url} alt={`${car.car_name} logo`} />
          </div>
          <h1>{car.car_name}</h1>
          <h2>{car.title}</h2>
          <p>{car.description}</p>
          <div className="car-details">
            <p><strong>Type:</strong> {car.car_type}</p>
            <p><strong>Company:</strong> {car.company}</p>
            <p><strong>Dealer:</strong> {car.dealer}</p>
            <p><strong>Tags:</strong> {car.tags}</p>
          </div>
          <div className="car-images">
            {car.images && car.images.length > 0 && car.images.map(image => (
              <img key={image.id} src={image.image_url} alt={`Car Image`} />
            ))}
          </div>

          {/* Edit and Delete Buttons */}
          <div className="car-actions">
            <button onClick={() => navigate(`/edit/${car.id}`)}>Edit</button>
            <button onClick={() => handleDelete(car.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
