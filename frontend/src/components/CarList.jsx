import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate } from "react-router-dom";

const CarList = () => {
    const [cars, setCars] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axiosInstance.get('/api/cars');
                setCars(response.data);
            } catch (error) {
                alert('Failed to fetch cars.');
            }
        };

        fetchCars();
    }, []);
    // handleRent and navigate to rentalform when user click button
    const handleRent = (car) => {
        console.log("Navigating with car data:", car);
        navigate(`/rentals`, { state: { car } });
    };

    return (
        <div>
            {cars.length === 0 ? (
                <p>Loading cars... Thank you for your patience... </p>
            ) : (
                cars.map((car) => (
                    <div key={car._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
                        <h2 className="font-bold">{car.brand} {car.model}</h2>
                        <p className="text-sm text-gray-500">Year: {car.year}</p>
                        <p className="text-sm text-gray-500">Price per day: ${car.pricePerDay}</p>
                        <div className="mt-2">
                            <button
                                onClick={() => handleRent(car)}
                                className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
                            >
                                Rent this car
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CarList;