import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Modal, Form, Alert, Pagination } from 'react-bootstrap';

interface PendingSkill {
  id: string;
  name: string;
  description: string;
  category: string;
  userId: string;
  userName: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const SkillModerationPanel: React.FC = () => {
  const [pendingSkills, setPendingSkills] = useState<PendingSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<PendingSkill | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPendingSkills();
  }, [filter, currentPage]);

  const fetchPendingSkills = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockSkills: PendingSkill[] = [
        {
          id: '1',
          name: 'Advanced React Patterns',
          description: 'Teaching advanced React patterns including render props, higher-order components, and custom hooks for building scalable applications.',
          category: 'TECHNOLOGY',
          userId: 'user1',
          userName: 'John Doe',
          submittedAt: '2024-01-15T10:30:00Z',
          status: 'PENDING'
        },
        {
          id: '2',
          name: 'Professional Photography',
          description: 'Offering professional photography services including portrait, landscape, and event photography with post-processing techniques.',
          category: 'PHOTOGRAPHY',
          userId: 'user2',
          userName: 'Jane Smith',
          submittedAt: '2024-01-14T15:45:00Z',
          status: 'PENDING'
        },
        {
          id: '3',
          name: 'Spam Skill Example',
          description: 'This is clearly spam content with inappropriate language and promotional material.',
          category: 'OTHER',
          userId: 'user3',
          userName: 'Spammer User',
          submittedAt: '2024-01-13T09:15:00Z',
          status: 'PENDING'
        },
        {
          id: '4',
          name: 'Digital Marketing Strategy',
          description: 'Comprehensive digital marketing strategy including SEO, social media marketing, and content creation for businesses.',
          category: 'BUSINESS',
          userId: 'user4',
          userName: 'Sarah Johnson',
          submittedAt: '2024-01-12T14:20:00Z',
          status: 'APPROVED'
        }
      ];
      
      const filteredSkills = filter === 'ALL' ? mockSkills : mockSkills.filter(skill => skill.status === filter);
      setPendingSkills(filteredSkills);
    } catch (error) {
      console.error('Error fetching pending skills:', error);
      setAlert({ type: 'danger', message: 'Failed to fetch pending skills' });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (skill: PendingSkill, action: 'approve' | 'reject') => {
    setSelectedSkill(skill);
    setActionType(action);
    setShowModal(true);
    setRejectionReason('');
  };

  const confirmAction = async () => {
    if (!selectedSkill) return;

    try {
      // TODO: API call to approve/reject skill
      console.log(`${actionType}ing skill:`, selectedSkill.id, rejectionReason);
      
      // Update local state
      setPendingSkills(prev => prev.map(skill => 
        skill.id === selectedSkill.id 
          ? { ...skill, status: actionType === 'approve' ? 'APPROVED' : 'REJECTED' }
          : skill
      ));

      setAlert({ 
        type: 'success', 
        message: `Skill "${selectedSkill.name}" has been ${actionType === 'approve' ? 'approved' : 'rejected'} successfully.` 
      });
      
      setShowModal(false);
      setSelectedSkill(null);
    } catch (error) {
      console.error(`Error ${actionType}ing skill:`, error);
      setAlert({ type: 'danger', message: `Failed to ${actionType} skill` });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'warning', text: 'Pending Review' },
      APPROVED: { variant: 'success', text: 'Approved' },
      REJECTED: { variant: 'danger', text: 'Rejected' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge bg={config.variant}>{config.text}</Badge>;
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

  const totalPages = Math.ceil(pendingSkills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSkills = pendingSkills.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="skill-moderation-panel">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="fas fa-cogs me-2" style={{ color: '#667eea' }}></i>
          Skill Moderation
        </h3>
        <div className="d-flex gap-2">
          <Form.Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            style={{ width: 'auto' }}
          >
            <option value="ALL">All Skills</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </Form.Select>
        </div>
      </div>

      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

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
                    <th>Skill Name</th>
                    <th>Category</th>
                    <th>User</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSkills.map((skill) => (
                    <tr key={skill.id}>
                      <td>
                        <div>
                          <strong>{skill.name}</strong>
                          <br />
                          <small className="text-muted">
                            {skill.description.substring(0, 80)}
                            {skill.description.length > 80 ? '...' : ''}
                          </small>
                        </div>
                      </td>
                      <td>
                        <Badge bg="secondary">{skill.category}</Badge>
                      </td>
                      <td>{skill.userName}</td>
                      <td>{formatDate(skill.submittedAt)}</td>
                      <td>{getStatusBadge(skill.status)}</td>
                      <td>
                        {skill.status === 'PENDING' && (
                          <div className="d-flex gap-2">
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() => handleAction(skill, 'approve')}
                            >
                              <i className="fas fa-check me-1"></i>
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleAction(skill, 'reject')}
                            >
                              <i className="fas fa-times me-1"></i>
                              Reject
                            </Button>
                          </div>
                        )}
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

      {/* Action Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === 'approve' ? 'Approve Skill' : 'Reject Skill'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSkill && (
            <div>
              <p><strong>Skill:</strong> {selectedSkill.name}</p>
              <p><strong>User:</strong> {selectedSkill.userName}</p>
              <p><strong>Description:</strong> {selectedSkill.description}</p>
              
              {actionType === 'reject' && (
                <Form.Group className="mt-3">
                  <Form.Label>Rejection Reason *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejecting this skill..."
                  />
                </Form.Group>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={actionType === 'approve' ? 'success' : 'danger'}
            onClick={confirmAction}
            disabled={actionType === 'reject' && !rejectionReason.trim()}
          >
            {actionType === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SkillModerationPanel;
