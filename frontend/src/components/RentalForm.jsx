import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useLocation } from 'react-router-dom';

const RentalForm = ({ rentals, setRentals, editingRental, setEditingRental }) => {
  const { user } = useAuth();
  const location = useLocation();
  const selectedCar = location.state?.car;

  console.log("🔍 Received selectedCar:", selectedCar);

  const [formData, setFormData] = useState({ pickupDate: '', returnDate: '' });

  useEffect(() => {
    if (editingRental) {
      setFormData({
        pickupDate: editingRental.pickupDate?.split("T")[0] || '',
        returnDate: editingRental.returnDate?.split("T")[0] || '',
      });
    } else {
      setFormData({ pickupDate: '', returnDate: '' });
    }
  }, [editingRental]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rentalData = {
      title: `${selectedCar.brand} ${selectedCar.model}`,
      carId: selectedCar._id,
      pickupDate: formData.pickupDate,
      returnDate: formData.returnDate
    };

    console.log("🔍 Sending Rental Data to Backend:", rentalData);

    if (!selectedCar) {
      alert("You haven't selected any car.");
      return;
    }
    if (!formData.pickupDate) {
      alert("Please select pickup date...");
      return;
    }
    if (!formData.returnDate) {
      alert("Please select return date...");
      return;
    }
    if (new Date(formData.pickupDate) < new Date()) {
      alert('Pickup date cannot be in the past.');
      return;
    }
    if (new Date(formData.returnDate) < new Date(formData.pickupDate)) {
      alert('Return date must be equal or after pickup date.');
      return;
    }

    try {
      if (editingRental) {
        // ✅ Update rental
        const response = await axiosInstance.put(`/api/rentals/${editingRental._id}`, {
          pickupDate: formData.pickupDate,
          returnDate: formData.returnDate,
        }, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setRentals(rentals.map((rental) => (rental._id === response.data._id ? response.data : rental)));
      } else {
        // ✅ Create rental
        await axiosInstance.post('/api/rentals', {
          title: `${selectedCar.brand} ${selectedCar.model}`,
          carId: selectedCar._id,
          pickupDate: formData.pickupDate,
          returnDate: formData.returnDate,
        }, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        // ✅ Refetch the updated rentals from backend
        const updatedRentals = await axiosInstance.get('/api/rentals', {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setRentals(updatedRentals.data);
      }

      setEditingRental(null);
      setFormData({ pickupDate: '', returnDate: '' });
    } catch (error) {
      console.error('❌ Failed to save rental:', error.response?.data || error.message);
      alert('Failed to save rental.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingRental ? 'Editing your Booking:' : 'You have selected this car:'}</h1>
      {selectedCar && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{selectedCar.brand} {selectedCar.model}</h2>
          <p className="text-sm text-gray-500">Year: {selectedCar.year}</p>
          <p className="text-sm text-gray-500">Price per day: ${selectedCar.pricePerDay}</p>
        </div>
      )}
      <label>Pickup Date</label>
      <input
        type="date"
        value={formData.pickupDate}
        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <label>Return Date</label>
      <input
        type="date"
        value={formData.returnDate}
        onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingRental ? 'Update Rental' : 'Confirm Rental'}
      </button>
    </form>
  );
};

export default RentalForm;
