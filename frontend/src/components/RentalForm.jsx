import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useLocation } from 'react-router-dom';

const RentalForm = ({ rentals, setRentals, editingRental, setEditingRental }) => {
  const { user } = useAuth();
  const location = useLocation();
  const selectedCar = location.state?.car;
  console.log("🔍 Received selectedCar:", selectedCar);
  const [formData, setFormData] = useState({ pickupDate: '', returnDate: '' }); // get car information


  useEffect(() => {
    if (editingRental) {
      setFormData({
        pickupDate: editingRental.pickupDate || '',
        returnDate: editingRental.returnDate || '',
      });
    } else {
      setFormData({ pickupDate: '', returnDate: '' });
    }
  }, [editingRental]);

  const handleSubmit = async (e) => {
    console.log("LocalStorage Token:", localStorage.getItem("token"));
    console.log("SessionStorage Token:", sessionStorage.getItem("token"));
    console.log("User Token from AuthContext:", user?.token);

    e.preventDefault();
    console.log("🔍 送出的 Car ID:", selectedCar._id);
    if (!selectedCar) {
      alert("You haven't selected any car.");
      return;

    }
    if (!formData.pickupDate) {
      alert("Please select a pickup date before you submitting...");
      return;
    }
    if (!formData.returnDate) {
      alert("Please select a return date before you submitting...");
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
      const response = await axiosInstance.post('/api/rentals', {
        title: `${selectedCar.brand} ${selectedCar.model}`,
        carId: selectedCar._id,
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate,
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setRentals([...rentals, response.data]);
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response);
        alert(`Failed to submit your rental: ${error.response.data.message || 'Unknown error'}`);
      } else {
        console.error('Error message:', error.message);
        alert('Failed to submit your rental.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingRental ? 'Editing your Booking:' :
        'You have selected this car:'}</h1>
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
        value={formData.pickupDate ? formData.pickupDate.split("T")[0] : ""}
        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <label>Return Date</label>
      <input
        type="date"
        value={formData.returnDate ? formData.returnDate.split("T")[0] : ""}
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