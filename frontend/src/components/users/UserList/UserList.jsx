import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import { useApp } from '../../../context/AppContext.jsx';
import adminService from '../../../services/adminService.js';
import userService from '../../../services/userService.js';
import UserCard from '../UserCard/UserCard.jsx';
import UserForm from '../UserForm/UserForm.jsx';
import { USER_ROLES } from '../../../utils/constants.js';
import './UserList.css';

const UserList = ({ showActions = true }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useApp();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, searchQuery, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAllUsersAdmin({
        name: searchQuery,
        role: roleFilter,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage
      });

      if (result.success) {
        setUsers(result.data.users || []);
        setPagination(prev => ({
          ...prev,
          totalPages: result.data.pagination?.totalPages || 1,
          totalItems: result.data.pagination?.totalItems || 0
        }));
      } else {
        showError(result.message || 'Failed to load users');
      }
    } catch (error) {
      showError('Error loading users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchUsers();
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowAddForm(true);
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setShowAddForm(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await userService.deleteUser(userId);
      if (result.success) {
        showSuccess('User deleted successfully');
        fetchUsers();
      } else {
        showError(result.message || 'Failed to delete user');
      }
    } catch (error) {
      showError('Error deleting user: ' + error.message);
    }
  };

  const handleFormSubmit = async (userData) => {
    try {
      let result;
      
      if (editingUser) {
        result = await userService.updateUser(editingUser.id, userData);
      } else {
        result = await userService.createUser(userData);
      }

      if (result.success) {
        showSuccess(`User ${editingUser ? 'updated' : 'created'} successfully`);
        setShowAddForm(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        showError(result.message || `Failed to ${editingUser ? 'update' : 'create'} user`);
      }
    } catch (error) {
      showError(`Error ${editingUser ? 'updating' : 'creating'} user: ` + error.message);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="user-list-container">
      {/* Header */}
      <div className="user-list-header">
        <div>
          <h1 className="user-list-title">User Management</h1>
          <p className="user-list-subtitle">
            Manage system users, roles, and permissions
          </p>
        </div>
        
        {showActions && (
          <button className="btn btn-primary" onClick={handleAddUser}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add User
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-gray-400)">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="role-filter"
          >
            <option value="">All Roles</option>
            <option value="system_admin">System Admin</option>
            <option value="store_owner">Store Owner</option>
            <option value="normal_user">Normal User</option>
          </select>
          
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      )}

      {/* User Grid */}
      {!loading && (
        <>
          {users.length > 0 ? (
            <>
              <div className="user-grid">
                {users.map((userData) => (
                  <UserCard
                    key={userData.id}
                    user={userData}
                    showActions={showActions}
                    onEdit={() => handleEditUser(userData)}
                    onDelete={() => handleDeleteUser(userData.id)}
                    onClick={() => navigate(`/users/${userData.id}`)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </button>
                  
                  <span className="pagination-info">
                    Page {pagination.currentPage} of {pagination.totalPages} 
                    ({pagination.totalItems} total users)
                  </span>
                  
                  <button
                    className="btn btn-secondary"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--color-gray-400)">
                <path d="M16 7c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5 5-2.24 5-5zM12 14c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/>
              </svg>
              <h3>No users found</h3>
              <p>
                {searchQuery || roleFilter
                  ? 'No users match your search criteria. Try adjusting your filters.'
                  : 'There are no users in the system yet.'
                }
              </p>
              <button className="btn btn-primary" onClick={handleAddUser}>
                Add First User
              </button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <UserForm
              user={editingUser}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowAddForm(false);
                setEditingUser(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
