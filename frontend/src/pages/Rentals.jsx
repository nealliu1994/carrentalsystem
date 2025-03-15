import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import RentalForm from '../components/RentalForm';
import RentalList from '../components/RentalList';
import { useAuth } from '../context/AuthContext';

const Rentals = () => {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [editingRental, setEditingRental] = useState(null);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axiosInstance.get('/api/rentals', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRentals(response.data);
      } catch (error) {
        alert('Failed to fetch rentals.');
      }
    };

    fetchRentals();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <RentalForm
        rentals={rentals}
        setRentals={setRentals}
        editingRental={editingRental}
        setEditingRental={setEditingRental}
      />
      <RentalList rentals={rentals} setRentals={setRentals} setEditingRental={setEditingRental} />
    </div>
  );
};

export default Rentals;
