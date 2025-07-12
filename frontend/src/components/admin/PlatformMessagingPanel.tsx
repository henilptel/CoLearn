import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Table, Badge, Modal, Row, Col } from 'react-bootstrap';

interface PlatformMessage {
  id: string;
  title: string;
  content: string;
  type: 'GENERAL' | 'MAINTENANCE' | 'FEATURE' | 'SECURITY' | 'PROMOTION';
  createdAt: string;
  isActive: boolean;
  targetAudience: 'ALL' | 'ACTIVE_USERS' | 'NEW_USERS' | 'PREMIUM_USERS';
}

interface MessageForm {
  title: string;
  content: string;
  type: 'GENERAL' | 'MAINTENANCE' | 'FEATURE' | 'SECURITY' | 'PROMOTION';
  targetAudience: 'ALL' | 'ACTIVE_USERS' | 'NEW_USERS' | 'PREMIUM_USERS';
}

const PlatformMessagingPanel: React.FC = () => {
  const [messages, setMessages] = useState<PlatformMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const [messageForm, setMessageForm] = useState<MessageForm>({
    title: '',
    content: '',
    type: 'GENERAL',
    targetAudience: 'ALL'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockMessages: PlatformMessage[] = [
        {
          id: '1',
          title: 'Platform Maintenance Notice',
          content: 'We will be performing scheduled maintenance on our servers this Sunday from 2:00 AM to 4:00 AM EST. During this time, the platform may be temporarily unavailable. We apologize for any inconvenience.',
          type: 'MAINTENANCE',
          createdAt: '2024-01-20T10:00:00Z',
          isActive: true,
          targetAudience: 'ALL'
        },
        {
          id: '2',
          title: 'New Feature: Video Calls',
          content: 'We are excited to announce our new video calling feature! Now you can have face-to-face skill exchange sessions directly through our platform. Check out the new "Video Call" button in your swap requests.',
          type: 'FEATURE',
          createdAt: '2024-01-18T14:30:00Z',
          isActive: true,
          targetAudience: 'ACTIVE_USERS'
        },
        {
          id: '3',
          title: 'Security Update',
          content: 'We have implemented additional security measures to protect your account. Please ensure your password is strong and consider enabling two-factor authentication in your account settings.',
          type: 'SECURITY',
          createdAt: '2024-01-15T09:15:00Z',
          isActive: true,
          targetAudience: 'ALL'
        },
        {
          id: '4',
          title: 'Welcome to CoLearn!',
          content: 'Welcome to our skill-sharing community! Get started by adding your skills to your profile and browsing other members to find interesting skill exchange opportunities.',
          type: 'GENERAL',
          createdAt: '2024-01-10T12:00:00Z',
          isActive: false,
          targetAudience: 'NEW_USERS'
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setAlert({ type: 'danger', message: 'Failed to fetch platform messages' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMessage = async () => {
    if (!messageForm.title.trim() || !messageForm.content.trim()) {
      setAlert({ type: 'danger', message: 'Please fill in all required fields' });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // TODO: API call to create message
      const newMessage: PlatformMessage = {
        id: Date.now().toString(),
        ...messageForm,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      setMessages(prev => [newMessage, ...prev]);
      setAlert({ type: 'success', message: 'Platform message created successfully!' });
      setShowCreateModal(false);
      setMessageForm({
        title: '',
        content: '',
        type: 'GENERAL',
        targetAudience: 'ALL'
      });
    } catch (error) {
      console.error('Error creating message:', error);
      setAlert({ type: 'danger', message: 'Failed to create platform message' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMessageStatus = async (messageId: string) => {
    try {
      // TODO: API call to toggle message status
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isActive: !msg.isActive }
          : msg
      ));
      
      setAlert({ type: 'success', message: 'Message status updated successfully!' });
    } catch (error) {
      console.error('Error updating message status:', error);
      setAlert({ type: 'danger', message: 'Failed to update message status' });
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      // TODO: API call to delete message
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setAlert({ type: 'success', message: 'Message deleted successfully!' });
    } catch (error) {
      console.error('Error deleting message:', error);
      setAlert({ type: 'danger', message: 'Failed to delete message' });
    }
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      GENERAL: { variant: 'primary', icon: 'info-circle' },
      MAINTENANCE: { variant: 'warning', icon: 'tools' },
      FEATURE: { variant: 'success', icon: 'star' },
      SECURITY: { variant: 'danger', icon: 'shield-alt' },
      PROMOTION: { variant: 'info', icon: 'megaphone' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig];
    return (
      <Badge bg={config.variant}>
        <i className={`fas fa-${config.icon} me-1`}></i>
        {type}
      </Badge>
    );
  };

  const getAudienceBadge = (audience: string) => {
    const audienceConfig = {
      ALL: { variant: 'dark', icon: 'users' },
      ACTIVE_USERS: { variant: 'success', icon: 'user-check' },
      NEW_USERS: { variant: 'info', icon: 'user-plus' },
      PREMIUM_USERS: { variant: 'warning', icon: 'crown' }
    };
    
    const config = audienceConfig[audience as keyof typeof audienceConfig];
    return (
      <Badge bg={config.variant}>
        <i className={`fas fa-${config.icon} me-1`}></i>
        {audience.replace('_', ' ')}
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

  return (
    <div className="platform-messaging-panel">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="fas fa-bullhorn me-2" style={{ color: '#667eea' }}></i>
          Platform Messages
        </h3>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Create Message
        </Button>
      </div>

      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      {/* Message Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center stats-card">
            <Card.Body>
              <h4 className="text-primary">{messages.length}</h4>
              <small className="text-muted">Total Messages</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center stats-card">
            <Card.Body>
              <h4 className="text-success">{messages.filter(m => m.isActive).length}</h4>
              <small className="text-muted">Active Messages</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center stats-card">
            <Card.Body>
              <h4 className="text-warning">{messages.filter(m => m.type === 'MAINTENANCE').length}</h4>
              <small className="text-muted">Maintenance Notices</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center stats-card">
            <Card.Body>
              <h4 className="text-info">{messages.filter(m => m.type === 'FEATURE').length}</h4>
              <small className="text-muted">Feature Announcements</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Audience</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id}>
                    <td>
                      <div>
                        <strong>{message.title}</strong>
                        <br />
                        <small className="text-muted">
                          {message.content.substring(0, 100)}
                          {message.content.length > 100 ? '...' : ''}
                        </small>
                      </div>
                    </td>
                    <td>{getTypeBadge(message.type)}</td>
                    <td>{getAudienceBadge(message.targetAudience)}</td>
                    <td>{formatDate(message.createdAt)}</td>
                    <td>
                      <Badge bg={message.isActive ? 'success' : 'secondary'}>
                        {message.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant={message.isActive ? 'outline-warning' : 'outline-success'}
                          onClick={() => toggleMessageStatus(message.id)}
                          title={message.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <i className={`fas fa-${message.isActive ? 'pause' : 'play'} me-1`}></i>
                          {message.isActive ? 'Pause' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => deleteMessage(message.id)}
                          title="Delete"
                        >
                          <i className="fas fa-trash me-1"></i>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Create Message Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create Platform Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Message Title *</Form.Label>
              <Form.Control
                type="text"
                value={messageForm.title}
                onChange={(e) => setMessageForm({ ...messageForm, title: e.target.value })}
                placeholder="Enter message title..."
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Message Type</Form.Label>
                  <Form.Select
                    value={messageForm.type}
                    onChange={(e) => setMessageForm({ ...messageForm, type: e.target.value as any })}
                  >
                    <option value="GENERAL">General</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="FEATURE">Feature Announcement</option>
                    <option value="SECURITY">Security Notice</option>
                    <option value="PROMOTION">Promotion</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Target Audience</Form.Label>
                  <Form.Select
                    value={messageForm.targetAudience}
                    onChange={(e) => setMessageForm({ ...messageForm, targetAudience: e.target.value as any })}
                  >
                    <option value="ALL">All Users</option>
                    <option value="ACTIVE_USERS">Active Users</option>
                    <option value="NEW_USERS">New Users</option>
                    <option value="PREMIUM_USERS">Premium Users</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Message Content *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={messageForm.content}
                onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                placeholder="Enter your message content here..."
              />
              <Form.Text className="text-muted">
                {messageForm.content.length}/500 characters
              </Form.Text>
            </Form.Group>

            <Alert variant="info">
              <i className="fas fa-info-circle me-2"></i>
              This message will be displayed to {messageForm.targetAudience.replace('_', ' ').toLowerCase()} in the platform notifications.
            </Alert>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateMessage}
            disabled={isSubmitting || !messageForm.title.trim() || !messageForm.content.trim()}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2"></i>
                Send Message
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PlatformMessagingPanel;
