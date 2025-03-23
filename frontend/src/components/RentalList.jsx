
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const RentalList = ({ rentals, setRentals, setEditingRental }) => {
  const { user } = useAuth();

  const handleDelete = async (rentalId) => {
    try {
      await axiosInstance.delete(`/api/rentals/${rentalId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setRentals(rentals.filter((rental) => rental._id !== rentalId));
    } catch (error) {
      alert('Failed to delete rental.');
    }
  };

  return (
    <div>
      {rentals.map((rental) => (
        <div key={rental._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{rental.carId && rental.carId.brand ?
            `${rental.brand} ${rental.model}` :
            'Car not available'}</h2>

          <p>{rental.year}</p>
          <p className="text-sm text-gray-500">Price per day: ${rental.pricePerDay ?? "N/A"}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingRental(rental)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(rental._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RentalList;




/*import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useEffect } from 'react';

const RentalList = ({ rentals, setRentals, setEditingRental }) => {
  const { user } = useAuth();

  useEffect(() => {
    console.log("🔍 Rental Data from API:", rentals);
  }, [rentals]);

  const handleDelete = async (rentalId) => {
    try {
      await axiosInstance.delete(`/api/rentals/${rentalId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setRentals(rentals.filter((rental) => rental._id !== rentalId));
    } catch (error) {
      alert('Failed to delete rental.');
    }
  };

  return (
    <div>
      {rentals.map((rental) => (
        <div key={rental._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{rental.carId && rental.carId.brand ?
            `${rental.carId.brand} ${rental.carId.model}` :
            'Car not available'}</h2>
          <p>Status: {rental.status}</p>
          <p className="text-sm text-gray-500">Year: {new Date(rental.year).toLocaleDateString()}</p>
          <p className="text-sm text-gray-500">Price per day: {new Date(rental.pricePerDay).toLocaleDateString()}</p>
          <p className="text-sm text-gray-500">
            Pickup Date: {rental.pickupDate ? new Date(rental.pickupDate).toISOString().split("T")[0] : "Invalid Date"}
          </p>
          <p className="text-sm text-gray-500">
            Return Date: {rental.returnDate ? new Date(rental.returnDate).toISOString().split("T")[0] : "Invalid Date"}
          </p>
          <div className="mt-2">
            <button
              onClick={() => setEditingRental(rental)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(rental._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RentalList;*/
