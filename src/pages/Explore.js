import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton CSS for styles

export default function Explore() {
  const [cars, setCars] = useState([]);
  const [display, setDisplay] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State to handle loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      if (!navigator.onLine) {
        setError('No internet connection. Please check your network and try again.');
        setIsLoading(false);
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
            ...(isLoggedIn && token && { Authorization: `Bearer ${token}` }),
          },
        };

        const response = await fetch(apiUrl, options);

        if (!response.ok) {
          navigate('/login');
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
        navigate('/login');
      } finally {
        setIsLoading(false); // Stop loading spinner
      }
    };

    fetchCars();
  }, [navigate]);

  if (error) {
    return (
      <div className="loading">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="car-page">
      {isLoading ? (
        <div>
          <div className='input' >
            <Skeleton count={1} height={40} style={{ marginBottom: '1rem' }} />
          </div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="car" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', width: '100px' }}>
                <Skeleton height={100} width={100} />
              </div>
              <h1><Skeleton width={200} /></h1>
              <h2><Skeleton width={150} /></h2>
              <div className="para">
                <div><Skeleton count={3} style={{ marginBottom: '.5rem' }} /></div>
              </div>

            </div>
          ))}
        </div>

      ) : (
        <>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              const searchTerm = e.target.value.toLowerCase();
              setSearch(searchTerm);
              if (!searchTerm) {
                setDisplay(cars);
              } else {
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

          {display.length > 0 ? (
            display.map((car) => (
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
                  {car.images && car.images.length > 0 ? (
                    car.images.map((image) => (
                      <img src={image.image_url} alt="Car" key={image.image_url} />
                    ))
                  ) : (
                    <Skeleton height={100} width={100} count={3} />
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No cars match your search.</p>
          )}
        </>
      )}
    </div>
  );
}
