import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Modal, Button, Alert, Pagination, Form, Row, Col } from 'react-bootstrap';

interface SwapRequest {
  id: string;
  requesterName: string;
  receiverName: string;
  skillOffered: string;
  skillWanted: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  message?: string;
}

interface SwapStats {
  total: number;
  pending: number;
  accepted: number;
  completed: number;
  cancelled: number;
  rejected: number;
}

const SwapMonitoringPanel: React.FC = () => {
  const [swaps, setSwaps] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger' | 'info'; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'ALL' | SwapRequest['status']>('ALL');
  const [stats, setStats] = useState<SwapStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
    cancelled: 0,
    rejected: 0
  });
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSwaps();
    fetchStats();
  }, [statusFilter, currentPage]);

  const fetchSwaps = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockSwaps: SwapRequest[] = [
        {
          id: '1',
          requesterName: 'John Doe',
          receiverName: 'Jane Smith',
          skillOffered: 'React Development',
          skillWanted: 'UI/UX Design',
          status: 'PENDING',
          createdAt: '2024-01-20T10:30:00Z',
          updatedAt: '2024-01-20T10:30:00Z',
          message: 'Hi! I would love to exchange my React skills for your design expertise.'
        },
        {
          id: '2',
          requesterName: 'Alice Johnson',
          receiverName: 'Bob Wilson',
          skillOffered: 'Digital Marketing',
          skillWanted: 'Photography',
          status: 'ACCEPTED',
          createdAt: '2024-01-19T14:20:00Z',
          updatedAt: '2024-01-19T16:45:00Z',
          message: 'Looking forward to learning photography techniques!'
        },
        {
          id: '3',
          requesterName: 'Charlie Brown',
          receiverName: 'Diana Prince',
          skillOffered: 'Data Science',
          skillWanted: 'Web Development',
          status: 'COMPLETED',
          createdAt: '2024-01-15T09:00:00Z',
          updatedAt: '2024-01-18T17:30:00Z',
          message: 'Great session! Thank you for the web development insights.'
        },
        {
          id: '4',
          requesterName: 'Eve Adams',
          receiverName: 'Frank Miller',
          skillOffered: 'Graphic Design',
          skillWanted: 'Content Writing',
          status: 'CANCELLED',
          createdAt: '2024-01-17T11:15:00Z',
          updatedAt: '2024-01-17T15:20:00Z',
          message: 'Unfortunately, I need to cancel due to schedule conflicts.'
        },
        {
          id: '5',
          requesterName: 'Grace Lee',
          receiverName: 'Henry Taylor',
          skillOffered: 'Music Production',
          skillWanted: 'Video Editing',
          status: 'REJECTED',
          createdAt: '2024-01-16T13:45:00Z',
          updatedAt: '2024-01-16T18:30:00Z',
          message: 'I would like to learn video editing for my music projects.'
        },
        {
          id: '6',
          requesterName: 'Ivy Chen',
          receiverName: 'Jack Anderson',
          skillOffered: 'Language Teaching (Spanish)',
          skillWanted: 'Cooking',
          status: 'PENDING',
          createdAt: '2024-01-18T08:30:00Z',
          updatedAt: '2024-01-18T08:30:00Z',
          message: 'I would love to learn cooking in exchange for Spanish lessons!'
        }
      ];
      
      const filteredSwaps = statusFilter === 'ALL' ? mockSwaps : mockSwaps.filter(swap => swap.status === statusFilter);
      setSwaps(filteredSwaps);
    } catch (error) {
      console.error('Error fetching swaps:', error);
      setAlert({ type: 'danger', message: 'Failed to fetch swap requests' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats calculation
      const mockSwaps: SwapRequest[] = [
        // Same mock data as above - in real app, this would be a separate API call
        { id: '1', requesterName: 'John Doe', receiverName: 'Jane Smith', skillOffered: 'React Development', skillWanted: 'UI/UX Design', status: 'PENDING', createdAt: '2024-01-20T10:30:00Z', updatedAt: '2024-01-20T10:30:00Z' },
        { id: '2', requesterName: 'Alice Johnson', receiverName: 'Bob Wilson', skillOffered: 'Digital Marketing', skillWanted: 'Photography', status: 'ACCEPTED', createdAt: '2024-01-19T14:20:00Z', updatedAt: '2024-01-19T16:45:00Z' },
        { id: '3', requesterName: 'Charlie Brown', receiverName: 'Diana Prince', skillOffered: 'Data Science', skillWanted: 'Web Development', status: 'COMPLETED', createdAt: '2024-01-15T09:00:00Z', updatedAt: '2024-01-18T17:30:00Z' },
        { id: '4', requesterName: 'Eve Adams', receiverName: 'Frank Miller', skillOffered: 'Graphic Design', skillWanted: 'Content Writing', status: 'CANCELLED', createdAt: '2024-01-17T11:15:00Z', updatedAt: '2024-01-17T15:20:00Z' },
        { id: '5', requesterName: 'Grace Lee', receiverName: 'Henry Taylor', skillOffered: 'Music Production', skillWanted: 'Video Editing', status: 'REJECTED', createdAt: '2024-01-16T13:45:00Z', updatedAt: '2024-01-16T18:30:00Z' },
        { id: '6', requesterName: 'Ivy Chen', receiverName: 'Jack Anderson', skillOffered: 'Language Teaching (Spanish)', skillWanted: 'Cooking', status: 'PENDING', createdAt: '2024-01-18T08:30:00Z', updatedAt: '2024-01-18T08:30:00Z' }
      ];

      const newStats: SwapStats = {
        total: mockSwaps.length,
        pending: mockSwaps.filter(s => s.status === 'PENDING').length,
        accepted: mockSwaps.filter(s => s.status === 'ACCEPTED').length,
        completed: mockSwaps.filter(s => s.status === 'COMPLETED').length,
        cancelled: mockSwaps.filter(s => s.status === 'CANCELLED').length,
        rejected: mockSwaps.filter(s => s.status === 'REJECTED').length
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleViewDetails = (swap: SwapRequest) => {
    setSelectedSwap(swap);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'warning', text: 'Pending', icon: 'clock' },
      ACCEPTED: { variant: 'info', text: 'Accepted', icon: 'handshake' },
      COMPLETED: { variant: 'success', text: 'Completed', icon: 'check-circle' },
      CANCELLED: { variant: 'secondary', text: 'Cancelled', icon: 'times-circle' },
      REJECTED: { variant: 'danger', text: 'Rejected', icon: 'times' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge bg={config.variant}>
        <i className={`fas fa-${config.icon} me-1`}></i>
        {config.text}
      </Badge>
    );
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

  const totalPages = Math.ceil(swaps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSwaps = swaps.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="swap-monitoring-panel">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="fas fa-chart-line me-2" style={{ color: '#667eea' }}></i>
          Swap Monitoring
        </h3>
      </div>

      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={2}>
          <Card className="text-center stats-card">
            <Card.Body>
              <h4 className="text-primary">{stats.total}</h4>
              <small className="text-muted">Total Swaps</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center stats-card">
            <Card.Body>
              <h4 className="text-warning">{stats.pending}</h4>
              <small className="text-muted">Pending</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center stats-card">
            <Card.Body>
              <h4 className="text-info">{stats.accepted}</h4>
              <small className="text-muted">Accepted</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center stats-card">
            <Card.Body>
              <h4 className="text-success">{stats.completed}</h4>
              <small className="text-muted">Completed</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center stats-card">
            <Card.Body>
              <h4 className="text-secondary">{stats.cancelled}</h4>
              <small className="text-muted">Cancelled</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center stats-card">
            <Card.Body>
              <h4 className="text-danger">{stats.rejected}</h4>
              <small className="text-muted">Rejected</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-3">
        <Card.Body>
          <div className="row g-3">
            <div className="col-md-4">
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REJECTED">Rejected</option>
              </Form.Select>
            </div>
            <div className="col-md-4">
              <Button
                variant="outline-primary"
                onClick={fetchSwaps}
                className="w-100"
              >
                <i className="fas fa-sync me-1"></i>
                Refresh Data
              </Button>
            </div>
            <div className="col-md-4">
              <Button
                variant="outline-success"
                className="w-100"
              >
                <i className="fas fa-download me-1"></i>
                Export Data
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
                    <th>Requester</th>
                    <th>Receiver</th>
                    <th>Skills Exchange</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSwaps.map((swap) => (
                    <tr key={swap.id}>
                      <td>
                        <strong>{swap.requesterName}</strong>
                      </td>
                      <td>
                        <strong>{swap.receiverName}</strong>
                      </td>
                      <td>
                        <div>
                          <Badge bg="primary" className="me-1">{swap.skillOffered}</Badge>
                          <i className="fas fa-exchange-alt mx-1 text-muted"></i>
                          <Badge bg="secondary">{swap.skillWanted}</Badge>
                        </div>
                      </td>
                      <td>{getStatusBadge(swap.status)}</td>
                      <td>{formatDate(swap.createdAt)}</td>
                      <td>{formatDate(swap.updatedAt)}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleViewDetails(swap)}
                          title="View Details"
                        >
                          <i className="fas fa-eye me-1"></i>
                          Details
                        </Button>
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

      {/* Swap Details Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Swap Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSwap && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <Card className="border-primary">
                    <Card.Header className="bg-primary text-white">
                      <i className="fas fa-user me-2"></i>Requester
                    </Card.Header>
                    <Card.Body>
                      <h6>{selectedSwap.requesterName}</h6>
                      <p><strong>Offering:</strong> {selectedSwap.skillOffered}</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-secondary">
                    <Card.Header className="bg-secondary text-white">
                      <i className="fas fa-user me-2"></i>Receiver
                    </Card.Header>
                    <Card.Body>
                      <h6>{selectedSwap.receiverName}</h6>
                      <p><strong>Wanted:</strong> {selectedSwap.skillWanted}</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <strong>Status:</strong><br />
                  {getStatusBadge(selectedSwap.status)}
                </Col>
                <Col md={4}>
                  <strong>Created:</strong><br />
                  {formatDate(selectedSwap.createdAt)}
                </Col>
                <Col md={4}>
                  <strong>Last Updated:</strong><br />
                  {formatDate(selectedSwap.updatedAt)}
                </Col>
              </Row>

              {selectedSwap.message && (
                <div>
                  <strong>Message:</strong>
                  <Card className="mt-2">
                    <Card.Body>
                      {selectedSwap.message}
                    </Card.Body>
                  </Card>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SwapMonitoringPanel;
