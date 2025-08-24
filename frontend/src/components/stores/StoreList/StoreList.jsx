import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import { useApp } from '../../../context/AppContext.jsx';
import storeService from '../../../services/storeService.js';
import adminService from '../../../services/adminService.js';
import StoreCard from '../StoreCard/StoreCard.jsx';
import StoreForm from '../StoreForm/StoreForm.jsx';
import { USER_ROLES } from '../../../utils/constants.js';
import './StoreList.css';

const StoreList = ({ showActions = true, allowRating = false }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useApp();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  useEffect(() => {
    fetchStores();
  }, [pagination.currentPage, searchQuery]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      let result;
      
      if (user?.role === USER_ROLES.SYSTEM_ADMIN) {
        // Admin can see all stores with comprehensive data
        result = await adminService.getAllStoresAdmin({
          name: searchQuery,
          page: pagination.currentPage,
          limit: pagination.itemsPerPage
        });
      } else {
        // Regular users see public store list
        if (searchQuery) {
          result = await storeService.searchStores({
            name: searchQuery,
            page: pagination.currentPage,
            limit: pagination.itemsPerPage
          });
        } else {
          result = await storeService.getAllStores({
            page: pagination.currentPage,
            limit: pagination.itemsPerPage
          });
        }
      }

      if (result.success) {
        setStores(result.data.stores || []);
        setPagination(prev => ({
          ...prev,
          totalPages: result.data.pagination?.totalPages || 1,
          totalItems: result.data.pagination?.totalItems || 0
        }));
      } else {
        showError(result.message || 'Failed to load stores');
      }
    } catch (error) {
      showError('Error loading stores: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchStores();
  };

  const handleAddStore = () => {
    setEditingStore(null);
    setShowAddForm(true);
  };

  const handleEditStore = (store) => {
    setEditingStore(store);
    setShowAddForm(true);
  };

  const handleDeleteStore = async (storeId) => {
    if (!window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await storeService.deleteStore(storeId);
      if (result.success) {
        showSuccess('Store deleted successfully');
        fetchStores();
      } else {
        showError(result.message || 'Failed to delete store');
      }
    } catch (error) {
      showError('Error deleting store: ' + error.message);
    }
  };

  const handleFormSubmit = async (storeData) => {
    try {
      let result;
      
      if (editingStore) {
        result = await storeService.updateStore(editingStore.id, storeData);
      } else {
        result = await storeService.createStore(storeData);
      }

      if (result.success) {
        showSuccess(`Store ${editingStore ? 'updated' : 'created'} successfully`);
        setShowAddForm(false);
        setEditingStore(null);
        fetchStores();
      } else {
        showError(result.message || `Failed to ${editingStore ? 'update' : 'create'} store`);
      }
    } catch (error) {
      showError(`Error ${editingStore ? 'updating' : 'creating'} store: ` + error.message);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="store-list-container">
      {/* Header */}
      <div className="store-list-header">
        <div>
          <h1 className="store-list-title">
            {user?.role === USER_ROLES.SYSTEM_ADMIN ? 'Manage Stores' : 'Browse Stores'}
          </h1>
          <p className="store-list-subtitle">
            {user?.role === USER_ROLES.SYSTEM_ADMIN 
              ? 'Add, edit, and manage stores in the system'
              : 'Discover amazing local stores and share your experience'
            }
          </p>
        </div>
        
        {showActions && user?.role === USER_ROLES.SYSTEM_ADMIN && (
          <button className="btn btn-primary" onClick={handleAddStore}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add Store
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-gray-400)">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search stores by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading stores...</p>
        </div>
      )}

      {/* Store Grid */}
      {!loading && (
        <>
          {stores.length > 0 ? (
            <>
              <div className="store-grid">
                {stores.map((store) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    showActions={showActions && user?.role === USER_ROLES.SYSTEM_ADMIN}
                    allowRating={allowRating && user?.role === USER_ROLES.NORMAL_USER}
                    onEdit={() => handleEditStore(store)}
                    onDelete={() => handleDeleteStore(store.id)}
                    onClick={() => navigate(`/stores/${store.id}`)}
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
                    ({pagination.totalItems} total stores)
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
                <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/>
              </svg>
              <h3>No stores found</h3>
              <p>
                {searchQuery 
                  ? `No stores match "${searchQuery}". Try a different search term.`
                  : 'There are no stores in the system yet.'
                }
              </p>
              {user?.role === USER_ROLES.SYSTEM_ADMIN && (
                <button className="btn btn-primary" onClick={handleAddStore}>
                  Add First Store
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <StoreForm
              store={editingStore}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowAddForm(false);
                setEditingStore(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreList;
