import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const RentalForm = ({ rentals, setRentals, editingRental, setEditingRental }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', description: '', deadline: '' });

  useEffect(() => {
    if (editingRental) {
      setFormData({
        title: editingRental.title,
        description: editingRental.description,
        deadline: editingRental.deadline,
      });
    } else {
      setFormData({ title: '', description: '', deadline: '' });
    }
  }, [editingRental]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRental) {
        const response = await axiosInstance.put(`/api/rentals/${editingRental._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRentals(rentals.map((rental) => (rental._id === response.data._id ? response.data : rental)));
      } else {
        const response = await axiosInstance.post('/api/rentals', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRentals([...rentals, response.data]);
      }
      setEditingRental(null);
      setFormData({ title: '', description: '', deadline: '' });
    } catch (error) {
      alert('Failed to save rental.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingRental ? 'Your Form Name: Edit Operation' : 'Your Form Name: Create Operation'}</h1>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingRental ? 'Update Button' : 'Create Button'}
      </button>
    </form>
  );
};

export default RentalForm;
