import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Modal, Form, Alert, Pagination, InputGroup } from 'react-bootstrap';

interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  status: 'ACTIVE' | 'BANNED' | 'SUSPENDED';
  skillsOffered: number;
  swapsCompleted: number;
  reportCount: number;
  lastActive: string;
}

interface BanUser {
  reason: string;
  duration: string;
}

const UserManagementPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banData, setBanData] = useState<BanUser>({ reason: '', duration: 'permanent' });
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'BANNED' | 'SUSPENDED'>('ALL');
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, searchTerm, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          joinedAt: '2024-01-15T10:30:00Z',
          status: 'ACTIVE',
          skillsOffered: 5,
          swapsCompleted: 12,
          reportCount: 0,
          lastActive: '2024-01-20T14:30:00Z'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          joinedAt: '2024-01-10T08:15:00Z',
          status: 'ACTIVE',
          skillsOffered: 3,
          swapsCompleted: 8,
          reportCount: 1,
          lastActive: '2024-01-19T16:45:00Z'
        },
        {
          id: '3',
          name: 'Spam User',
          email: 'spam@example.com',
          joinedAt: '2024-01-05T12:00:00Z',
          status: 'BANNED',
          skillsOffered: 1,
          swapsCompleted: 0,
          reportCount: 5,
          lastActive: '2024-01-06T10:00:00Z'
        },
        {
          id: '4',
          name: 'Alice Johnson',
          email: 'alice.johnson@example.com',
          joinedAt: '2024-01-12T14:20:00Z',
          status: 'ACTIVE',
          skillsOffered: 7,
          swapsCompleted: 15,
          reportCount: 0,
          lastActive: '2024-01-20T12:15:00Z'
        },
        {
          id: '5',
          name: 'Suspicious User',
          email: 'suspicious@example.com',
          joinedAt: '2024-01-08T09:30:00Z',
          status: 'SUSPENDED',
          skillsOffered: 2,
          swapsCompleted: 3,
          reportCount: 3,
          lastActive: '2024-01-15T11:20:00Z'
        }
      ];
      
      let filteredUsers = mockUsers;
      
      if (statusFilter !== 'ALL') {
        filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
      }
      
      if (searchTerm) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setAlert({ type: 'danger', message: 'Failed to fetch users' });
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = (user: User) => {
    setSelectedUser(user);
    setShowBanModal(true);
    setBanData({ reason: '', duration: 'permanent' });
  };

  const confirmBan = async () => {
    if (!selectedUser || !banData.reason.trim()) return;

    try {
      // TODO: API call to ban user
      console.log('Banning user:', selectedUser.id, banData);
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, status: 'BANNED' as const }
          : user
      ));

      setAlert({ 
        type: 'success', 
        message: `User "${selectedUser.name}" has been banned successfully.` 
      });
      
      setShowBanModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error banning user:', error);
      setAlert({ type: 'danger', message: 'Failed to ban user' });
    }
  };

  const handleUnbanUser = async (user: User) => {
    try {
      // TODO: API call to unban user
      console.log('Unbanning user:', user.id);
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === user.id 
          ? { ...u, status: 'ACTIVE' as const }
          : u
      ));

      setAlert({ 
        type: 'success', 
        message: `User "${user.name}" has been unbanned successfully.` 
      });
    } catch (error) {
      console.error('Error unbanning user:', error);
      setAlert({ type: 'danger', message: 'Failed to unban user' });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { variant: 'success', text: 'Active' },
      BANNED: { variant: 'danger', text: 'Banned' },
      SUSPENDED: { variant: 'warning', text: 'Suspended' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="user-management-panel">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="fas fa-user-shield me-2" style={{ color: '#667eea' }}></i>
          User Management
        </h3>
      </div>

      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-3">
        <Card.Body>
          <div className="row g-3">
            <div className="col-md-6">
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>
            <div className="col-md-3">
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="BANNED">Banned</option>
                <option value="SUSPENDED">Suspended</option>
              </Form.Select>
            </div>
            <div className="col-md-3">
              <Button
                variant="outline-primary"
                onClick={fetchUsers}
                className="w-100"
              >
                <i className="fas fa-sync me-1"></i>
                Refresh
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Status</th>
                    <th>Skills</th>
                    <th>Swaps</th>
                    <th>Reports</th>
                    <th>Joined</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div>
                          <strong>{user.name}</strong>
                          <br />
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td>
                        <Badge bg="info">{user.skillsOffered}</Badge>
                      </td>
                      <td>
                        <Badge bg="success">{user.swapsCompleted}</Badge>
                      </td>
                      <td>
                        {user.reportCount > 0 ? (
                          <Badge bg="warning">{user.reportCount}</Badge>
                        ) : (
                          <Badge bg="light" text="dark">0</Badge>
                        )}
                      </td>
                      <td>{formatDate(user.joinedAt)}</td>
                      <td>{formatDate(user.lastActive)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          {user.status === 'ACTIVE' && (
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleBanUser(user)}
                              title="Ban User"
                            >
                              <i className="fas fa-ban me-1"></i>
                              Ban
                            </Button>
                          )}
                          {user.status === 'BANNED' && (
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() => handleUnbanUser(user)}
                              title="Unban User"
                            >
                              <i className="fas fa-user-check me-1"></i>
                              Unban
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline-primary"
                            title="View Profile"
                          >
                            <i className="fas fa-eye me-1"></i>
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.Prev 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Ban User Modal */}
      <Modal show={showBanModal} onHide={() => setShowBanModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ban User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <Alert variant="warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                You are about to ban user <strong>{selectedUser.name}</strong>. This action will prevent them from accessing the platform.
              </Alert>
              
              <Form.Group className="mb-3">
                <Form.Label>Reason for Ban *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={banData.reason}
                  onChange={(e) => setBanData({ ...banData, reason: e.target.value })}
                  placeholder="Please provide a detailed reason for banning this user..."
                />
              </Form.Group>
              
              <Form.Group>
                <Form.Label>Ban Duration</Form.Label>
                <Form.Select
                  value={banData.duration}
                  onChange={(e) => setBanData({ ...banData, duration: e.target.value })}
                >
                  <option value="permanent">Permanent</option>
                  <option value="30days">30 Days</option>
                  <option value="7days">7 Days</option>
                  <option value="24hours">24 Hours</option>
                </Form.Select>
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBanModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmBan}
            disabled={!banData.reason.trim()}
          >
            <i className="fas fa-ban me-1"></i>
            Ban User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagementPanel;
