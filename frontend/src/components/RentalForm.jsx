import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useLocation } from 'react-router-dom';

const RentalForm = ({ rentals, setRentals, editingRental, setEditingRental }) => {
  const { user } = useAuth();
  const location = useLocation();
  const selectedCar = location.state?.car;

  console.log("Selected Car passed to RentalForm:", selectedCar);

  const [formData, setFormData] = useState({ pickupDate: '', returnDate: '' });



  useEffect(() => {
    if (editingRental) {
      setFormData({
        brand: editingRental.carId?.brand || selectedCar?.brand || '',
        model: editingRental.carId?.model || selectedCar?.model || '',
        year: editingRental.carId?.year || selectedCar?.year || '',
        pricePerDay: editingRental.carId?.pricePerDay || selectedCar?.pricePerDay || '',
        pickupDate: editingRental.pickupDate ? editingRental.pickupDate.split('T')[0] : '',
        returnDate: editingRental.returnDate ? editingRental.returnDate.split('T')[0] : '',
      });
    } else if (selectedCar) {
      setFormData({
        brand: selectedCar.brand || '',
        model: selectedCar.model || '',
        year: selectedCar.year || '',
        pricePerDay: selectedCar.pricePerDay || '',
        pickupDate: '',
        returnDate: '',
      });
    }
  }, [editingRental, selectedCar]);

  const fetchRentals = async () => {
    try {
      const response = await axiosInstance.get('/api/rentals', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setRentals(response.data);
    } catch (error) {
      console.error('Failed to fetch rentals:', error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // constrains
    try {
      if (!selectedCar && !editingRental) {
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
      const payload = editingRental ? {
        carId: selectedCar?._id || editingRental.carId,
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate
      } : {
        carId: selectedCar._id,
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate
      };

      if (editingRental) {
        console.log(formData)
        const response = await axiosInstance.put(`/api/rentals/${editingRental._id}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRentals(rentals.map((rental) => (rental._id === response.data._id ? response.data : rental)));
      } else {
        const response = await axiosInstance.post('/api/rentals', payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log(response.data)
        setRentals([...rentals, response.data]);
      }

      fetchRentals();

      setEditingRental(null);
      setFormData({ pickupDate: '', returnDate: '' });

    } catch (error) {
      console.error('Failed to save rental:', error.response?.data || error.message);
      alert(`Failed to save rental: ${error.response?.data?.message || error.message}`);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingRental ? 'Editing your Booking:' :
        'You have selected this car:'}</h1>
      {(selectedCar || editingRental) && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{formData.brand} {formData.model}</h2>
          <p className="text-m text-gray-500">{formData.year}</p>
          <p className="text-xl text-green-900 font-bold">Price per Day: ${formData.pricePerDay}</p>
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
