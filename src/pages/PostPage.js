import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'

export default function PostPage() {
  const [cars, setCars] = useState([]);
  const [display, setDisplay] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      const accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        navigate('/login');
        return;
      }

      if (!navigator.onLine) {
        setError('No internet connection. Please check your network and try again.');
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

        if (!carData || carData.length === 0) {
          setTimeout(() => {
            navigate('/create');
          }, 2000); 
        } else {
          setCars(carData);
          setDisplay(carData);
        }

        localStorage.setItem('isLoggedIn', 'true');
      } catch (error) {
        console.error('Error fetching cars:', error);
        setError('Failed to fetch car data. Please try again later.');
      }
    };

    fetchCars();
  }, [navigate]);

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

  if (error) return <p>{error}</p>;
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
            const searchTerm = e.target.value.toLowerCase();
            setDisplay(
              cars.filter((car) =>
                car.description.toLowerCase().includes(searchTerm) ||
                car.title.toLowerCase().includes(searchTerm) ||
                car.tags.toLowerCase().includes(searchTerm)
              )
            );
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
          <div className="description">
          <p >{car.description}</p>
          </div>
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
          <div className="car-actions">
            <button onClick={() => navigate(`/edit/${car.id}`)}>Edit</button>
            <button onClick={() => handleDelete(car.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
