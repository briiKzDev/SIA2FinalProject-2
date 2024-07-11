import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ManageAccount.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IconButton, Modal, Box, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
 
function ManageAccount() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
 
  useEffect(() => {
    fetchUsers();
  }, []);
 
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://192.168.10.24:3004/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
 
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://192.168.10.24:3004/api/users/${userId}`);
      console.log('after deletion should show this log to indicate that the deletion was successful');
      navigate('/ManageAccount');
      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };
 
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
 
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
 
  const handleEditUser = async () => {
    try {
      console.log('Selected user before update:', selectedUser);
      const response = await axios.put(`http://192.168.10.24:3004/edituser/${selectedUser._id}`, selectedUser);
      console.log('Update response:', response);
      handleModalClose();
      fetchUsers();
      alert('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };
 
  const handleRoleChange = (e) => {
    setSelectedUser({ ...selectedUser, userRole: e.target.value });
  };
 
  return (
    <div className="manage-account-container">
      <div className="sidebar">
      <Link to="/ManageProduct" className="sidebar-link">Manage Products</Link>
        <Link to="/ManageAccount" className="sidebar-link">Manage Account</Link>
        <Link to="/Report" className="sidebar-link">Reports</Link>
      </div>
      <div className="content">
        <h1>Manage Account</h1>
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>User Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.userRole}</td>
                <td className="actions">
                  <IconButton onClick={() => deleteUser(user._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEditClick(user)} color="primary">
                    <EditIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box sx={{ ...modalStyle }}>
          <h2>Edit User</h2>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={selectedUser?.username || ''}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={selectedUser?.email || ''}
            onChange={handleInputChange}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>User Role</InputLabel>
            <Select
              name="userRole"
              value={selectedUser?.userRole || ''}
              onChange={handleRoleChange}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="inventory">Inventory</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditUser}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
 
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
 
export default ManageAccount;