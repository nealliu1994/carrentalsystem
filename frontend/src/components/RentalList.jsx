
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
  console.log(rentals)
  return (
    <div>
      {rentals.map((rental) => (
        <div key={rental._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{rental.carId && rental.carId.brand ?
            `${rental.carId.brand} ${rental.carId.model}` :
            'Car not available'}</h2>

          <p>{rental.carId.year}</p>
          <p className="text-sm text-gray-500">Pickup date: {rental.pickupDate ?? "N/A"}</p>
          <p className="text-sm text-gray-500">Return date: {rental.returnDate ?? "N/A"}</p>
          <p className="text-l text-black-500 font-bold">Price per day: ${rental.carId.pricePerDay ?? "N/A"}</p>

          <div className="mt-2">
            <button
              onClick={() => setEditingRental(rental)}
              className="mr-2 bg-green-700 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(rental._id)}
              className="bg-orange-700 text-white px-4 py-2 rounded"
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




