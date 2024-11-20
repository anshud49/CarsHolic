import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Explore() {
  const [cars, setCars] = useState([]);
  const [display, setDisplay] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      if (!navigator.onLine) {
        setError('No internet connection. Please check your network and try again.');
        return;
      }

      try {
        
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const token = localStorage.getItem('access_token');

        
        let apiUrl = 'https://carsholic.vercel.app/api/cars/';

        if (isLoggedIn) {
          apiUrl += `?isLoggedin=true`;
        }

      
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(isLoggedIn && token && { Authorization: `Bearer ${token}` }), // Add token header if logged in
          },
        };

        const response = await fetch(apiUrl, options);

        if (!response.ok) {
          setError('Failed to fetch car data. Please try again later.');
          return;
        }

        const carData = await response.json();

        if (!carData || carData.length === 0) {
          setError('No cars available to explore.');
        } else {
          setCars(carData);
          setDisplay(carData);
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
        setError('Failed to fetch car data. Please try again later.');
      }
    };

    fetchCars();
  }, []);

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
            <p>{car.description}</p>
          </div>
          <div className="car-details">
            <p><strong>Type:</strong> {car.car_type}</p>
            <p><strong>Company:</strong> {car.company}</p>
            <p><strong>Dealer:</strong> {car.dealer}</p>
            <p><strong>Tags:</strong> {car.tags}</p>
          </div>
          <div className="car-images">
            {car.images && car.images.length > 0 && car.images.map((image) => (
              <img src={image.image_url} alt={`Car Image`} key={image.image_url} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
