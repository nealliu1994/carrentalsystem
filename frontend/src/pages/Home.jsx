import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import CarList from '../components/CarList';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [rentingCar, setRentingCar] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axiosInstance.get('/api/cars');
        setCars(response.data);
      } catch (error) {
        alert('Failed to fetch car list.');
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <CarList cars={cars} setRentingCar={setRentingCar} />
      {/*display the car that user chose*/}
      {rentingCar && (
        <div className="mt-6">
          <h2 className="font-bold">You have selected:</h2>
          <p>{rentingCar.brand} {rentingCar.model} - ${rentingCar.pricePerDay} per day</p>
        </div>
      )}
    </div>
  );
};

export default Home;