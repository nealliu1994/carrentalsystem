import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const RentalList = ({ rentals, setRental, setEditingRental }) => {
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
          <h2 className="font-bold">{rental.title}</h2>
          <p>{rental.description}</p>
          <p className="text-sm text-gray-500">Deadline: {new Date(rental.deadline).toLocaleDateString()}</p>
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
