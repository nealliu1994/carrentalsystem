import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import RentalForm from '../components/RentalForm';
import RentalList from '../components/RentalList';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Rentals = () => {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [editingRental, setEditingRental] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axiosInstance.get('/api/rentals', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRentals(response.data);
      } catch (error) {
        navigate('/login');
      }
    };

    fetchRentals();
  }, [user, navigate]);

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
