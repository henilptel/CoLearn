import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useSwapRequests } from '../contexts/SwapRequestContext';
import type { SwapRequest } from '../types';

const SwapRequests: React.FC = () => {
  const { currentUser } = useUser();
  const { requests, acceptRequest, rejectRequest, loading } = useSwapRequests();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter requests based on current user
  const sentRequests = requests.filter(req => req.fromUserId === currentUser?.id);
  const receivedRequests = requests.filter(req => req.toUserId === currentUser?.id);

  // Apply filters
  const getFilteredRequests = (requestsList: SwapRequest[]) => {
    let filtered = requestsList;

    // Status filter
    if (filter !== 'all') {
      filtered = filtered.filter(req => req.status === filter);
    }

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(req => 
        req.fromUserName.toLowerCase().includes(search) ||
        req.toUserName.toLowerCase().includes(search) ||
        req.offeredSkill.toLowerCase().includes(search) ||
        req.requestedSkill.toLowerCase().includes(search) ||
        req.message.toLowerCase().includes(search)
      );
    }

    return filtered;
  };

  const currentRequests = activeTab === 'received' ? receivedRequests : sentRequests;
  const filteredRequests = getFilteredRequests(currentRequests);

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'profile-notification success';
      notification.textContent = 'Request accepted successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    } catch (error) {
      alert('Failed to accept request. Please try again.');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectRequest(requestId);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'profile-notification success';
      notification.textContent = 'Request rejected successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    } catch (error) {
      alert('Failed to reject request. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'accepted': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!currentUser) {
    return (
      <div className="swap-requests-page">
        <div className="error-message">
          <h3>Please log in to view your requests</h3>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="swap-requests-page">
      {/* Header */}
      <header className="requests-header">
        <nav className="requests-nav">
          <div className="nav-left">
            <button onClick={() => navigate('/')} className="nav-btn">
              ← Back to Home
            </button>
          </div>
          
          <div className="nav-center">
            <h1 className="page-title">Swap Requests</h1>
          </div>
          
          <div className="nav-right">
            <button onClick={() => navigate('/my-profile')} className="nav-btn">
              My Profile
            </button>
            <div className="profile-avatar-small">
              {getInitials(currentUser.name)}
            </div>
          </div>
        </nav>
      </header>

      <div className="requests-container">
        {/* Tabs */}
        <div className="requests-tabs">
          <button
            className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Received ({receivedRequests.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Sent ({sentRequests.length})
          </button>
        </div>

        {/* Filters */}
        <div className="requests-filters">
          <div className="filter-group">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-search"
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="requests-summary">
          <span>
            {filteredRequests.length === currentRequests.length 
              ? `Showing all ${currentRequests.length} requests`
              : `Found ${filteredRequests.length} of ${currentRequests.length} requests`
            }
          </span>
        </div>

        {/* Requests List */}
        <div className="requests-list">
          {loading ? (
            <div className="requests-loading">
              <div className="spinner" />
              <p>Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="requests-empty">
              <div className="empty-icon">📋</div>
              <h3>No requests found</h3>
              <p>
                {currentRequests.length === 0 
                  ? activeTab === 'received' 
                    ? "You haven't received any swap requests yet." 
                    : "You haven't sent any swap requests yet."
                  : "No requests match your current filters."
                }
              </p>
              {currentRequests.length === 0 && activeTab === 'sent' && (
                <button 
                  onClick={() => navigate('/')}
                  className="btn-primary"
                >
                  Browse Members
                </button>
              )}
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="request-card-header">
                  <div className="request-user">
                    <div className="request-avatar">
                      {getInitials(activeTab === 'received' ? request.fromUserName : request.toUserName)}
                    </div>
                    <div className="request-user-info">
                      <h3 className="request-user-name">
                        {activeTab === 'received' ? request.fromUserName : request.toUserName}
                      </h3>
                      <p className="request-date">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="request-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {getStatusText(request.status)}
                    </span>
                  </div>
                </div>

                <div className="request-card-body">
                  <div className="request-skills">
                    <div className="skill-exchange">
                      <div className="skill-item">
                        <span className="skill-label">
                          {activeTab === 'received' ? 'They offer:' : 'You offered:'}
                        </span>
                        <span className="skill-tag offered">{request.offeredSkill}</span>
                      </div>
                      <div className="skill-arrow">⇄</div>
                      <div className="skill-item">
                        <span className="skill-label">
                          {activeTab === 'received' ? 'They want:' : 'You requested:'}
                        </span>
                        <span className="skill-tag wanted">{request.requestedSkill}</span>
                      </div>
                    </div>
                  </div>

                  <div className="request-message">
                    <span className="message-label">Message:</span>
                    <p className="message-text">{request.message}</p>
                  </div>
                </div>

                <div className="request-card-actions">
                  <button
                    onClick={() => navigate(`/profile/${activeTab === 'received' ? request.fromUserId : request.toUserId}`)}
                    className="action-btn view-profile-btn"
                  >
                    View Profile
                  </button>
                  
                  {activeTab === 'received' && request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="action-btn accept-btn"
                        disabled={loading}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="action-btn reject-btn"
                        disabled={loading}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapRequests;