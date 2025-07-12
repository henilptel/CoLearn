import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Dropdown, Button } from 'react-bootstrap';
import SkillModerationPanel from '../components/admin/SkillModerationPanel';
import UserManagementPanel from '../components/admin/UserManagementPanel';
import SwapMonitoringPanel from '../components/admin/SwapMonitoringPanel';
import PlatformMessagingPanel from '../components/admin/PlatformMessagingPanel';
import ReportsPanel from '../components/admin/ReportsPanel';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    pendingSkills: 0,
    activeSwaps: 0,
    reportedUsers: 0,
    pendingReports: 0
  });

  useEffect(() => {
    // TODO: Fetch dashboard stats from API
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Mock data for now
      setDashboardStats({
        totalUsers: 1234,
        pendingSkills: 15,
        activeSwaps: 89,
        reportedUsers: 3,
        pendingReports: 7
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: dashboardStats.totalUsers,
      icon: 'fas fa-users',
      color: '#3b82f6',
      bgGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Skills Under Review',
      value: dashboardStats.pendingSkills,
      icon: 'fas fa-clock',
      color: '#06b6d4',
      bgGradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      change: '+3',
      changeType: 'neutral'
    },
    {
      title: 'Active Swaps',
      value: dashboardStats.activeSwaps,
      icon: 'fas fa-exchange-alt',
      color: '#0ea5e9',
      bgGradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Pending Reports',
      value: dashboardStats.pendingReports,
      icon: 'fas fa-flag',
      color: '#8b5cf6',
      bgGradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      change: '-2',
      changeType: 'positive'
    }
  ];

  return (
    <div className="modern-admin-dashboard">
      {/* Header Section */}
      <div className="admin-header">
        <Container fluid>
          <Row className="align-items-center">
            <Col>
              <div className="admin-header-content">
                <div className="admin-title-section">
                  <h1 className="admin-main-title">
                    <div className="admin-icon-wrapper">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    Admin Dashboard
                  </h1>
                  <p className="admin-subtitle">Manage your CoLearn platform with ease</p>
                </div>
                <div className="admin-actions">
                  <Button variant="outline-light" className="me-2">
                    <i className="fas fa-download me-2"></i>
                    Export Data
                  </Button>
                  <Dropdown>
                    <Dropdown.Toggle variant="light" className="admin-profile-btn">
                      <i className="fas fa-user-circle me-2"></i>
                      Admin
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item><i className="fas fa-cog me-2"></i>Settings</Dropdown.Item>
                      <Dropdown.Item><i className="fas fa-sign-out-alt me-2"></i>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Content */}
      <Container fluid className="admin-content">
        {/* Stats Cards */}
        <Row className="stats-section mb-4">
          {statsCards.map((stat, index) => (
            <Col lg={3} md={6} key={index} className="mb-4">
              <Card className="modern-stats-card h-100">
                <Card.Body>
                  <div className="stats-card-content">
                    <div className="stats-icon-section">
                      <div 
                        className="stats-icon-wrapper"
                        style={{ background: stat.bgGradient }}
                      >
                        <i className={stat.icon}></i>
                      </div>
                    </div>
                    <div className="stats-info">
                      <h3 className="stats-value">{stat.value.toLocaleString()}</h3>
                      <p className="stats-title">{stat.title}</p>
                      <div className={`stats-change ${stat.changeType}`}>
                        <i className={`fas ${stat.changeType === 'positive' ? 'fa-arrow-up' : 'fa-arrow-down'} me-1`}></i>
                        {stat.change} from last month
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Navigation Tabs */}
        <Row className="mb-4">
          <Col>
            <Card className="nav-card">
              <Card.Body className="p-0">
                <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'overview')}>
                  <Nav variant="pills" className="modern-nav-pills">
                    <Nav.Item>
                      <Nav.Link eventKey="overview">
                        <i className="fas fa-chart-pie me-2"></i>
                        Overview
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="skills">
                        <i className="fas fa-cogs me-2"></i>
                        Skills
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="users">
                        <i className="fas fa-users me-2"></i>
                        Users
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="swaps">
                        <i className="fas fa-exchange-alt me-2"></i>
                        Swaps
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="messages">
                        <i className="fas fa-bullhorn me-2"></i>
                        Messages
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="reports">
                        <i className="fas fa-chart-bar me-2"></i>
                        Reports
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Tab.Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tab Content */}
        <Row>
          <Col>
            <Tab.Container activeKey={activeTab}>
              <Tab.Content>
                <Tab.Pane eventKey="overview">
                  <Card className="content-card">
                    <Card.Body>
                      <div className="overview-dashboard">
                        <div className="dashboard-header mb-4">
                          <h2 className="dashboard-title">
                            <i className="fas fa-chart-line me-3"></i>
                            Platform Analytics Dashboard
                          </h2>
                          <p className="dashboard-subtitle">Real-time insights and key performance metrics</p>
                        </div>

                        {/* Key Metrics Row */}
                        <Row className="mb-4">
                          <Col md={3} className="mb-3">
                            <Card className="metric-card metric-users">
                              <Card.Body className="text-center">
                                <div className="metric-icon mb-3">
                                  <i className="fas fa-user-friends"></i>
                                </div>
                                <h3 className="metric-value">{dashboardStats.totalUsers}</h3>
                                <p className="metric-label">Registered Users</p>
                                <div className="metric-trend positive">
                                  <i className="fas fa-arrow-up me-1"></i>
                                  +12% this month
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                          
                          <Col md={3} className="mb-3">
                            <Card className="metric-card metric-skills">
                              <Card.Body className="text-center">
                                <div className="metric-icon mb-3">
                                  <i className="fas fa-cogs"></i>
                                </div>
                                <h3 className="metric-value">847</h3>
                                <p className="metric-label">Total Skills</p>
                                <div className="metric-trend positive">
                                  <i className="fas fa-arrow-up me-1"></i>
                                  +24 this week
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                          
                          <Col md={3} className="mb-3">
                            <Card className="metric-card metric-swaps">
                              <Card.Body className="text-center">
                                <div className="metric-icon mb-3">
                                  <i className="fas fa-handshake"></i>
                                </div>
                                <h3 className="metric-value">2,156</h3>
                                <p className="metric-label">Completed Swaps</p>
                                <div className="metric-trend positive">
                                  <i className="fas fa-arrow-up me-1"></i>
                                  +18% this month
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                          
                          <Col md={3} className="mb-3">
                            <Card className="metric-card metric-rating">
                              <Card.Body className="text-center">
                                <div className="metric-icon mb-3">
                                  <i className="fas fa-star"></i>
                                </div>
                                <h3 className="metric-value">4.8</h3>
                                <p className="metric-label">Avg Rating</p>
                                <div className="metric-trend positive">
                                  <i className="fas fa-arrow-up me-1"></i>
                                  +0.2 this month
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>

                        {/* Charts and Activity Section */}
                        <Row className="mb-4">
                          <Col md={8}>
                            <Card className="chart-card">
                              <Card.Header>
                                <h5>
                                  <i className="fas fa-chart-bar me-2"></i>
                                  Platform Activity Overview
                                </h5>
                              </Card.Header>
                              <Card.Body>
                                <div className="activity-stats">
                                  <Row>
                                    <Col md={4} className="text-center mb-3">
                                      <div className="activity-stat">
                                        <div className="stat-icon">
                                          <i className="fas fa-user-plus"></i>
                                        </div>
                                        <h4>156</h4>
                                        <p>New Users This Week</p>
                                      </div>
                                    </Col>
                                    <Col md={4} className="text-center mb-3">
                                      <div className="activity-stat">
                                        <div className="stat-icon">
                                          <i className="fas fa-calendar-check"></i>
                                        </div>
                                        <h4>89</h4>
                                        <p>Sessions Scheduled</p>
                                      </div>
                                    </Col>
                                    <Col md={4} className="text-center mb-3">
                                      <div className="activity-stat">
                                        <div className="stat-icon">
                                          <i className="fas fa-comments"></i>
                                        </div>
                                        <h4>324</h4>
                                        <p>Messages Exchanged</p>
                                      </div>
                                    </Col>
                                  </Row>
                                  
                                  <div className="progress-section mt-4">
                                    <h6 className="mb-3">Platform Health Metrics</h6>
                                    <div className="health-metric mb-3">
                                      <div className="d-flex justify-content-between mb-1">
                                        <span>User Engagement</span>
                                        <span>87%</span>
                                      </div>
                                      <div className="progress">
                                        <div className="progress-bar bg-success" style={{ width: '87%' }}></div>
                                      </div>
                                    </div>
                                    <div className="health-metric mb-3">
                                      <div className="d-flex justify-content-between mb-1">
                                        <span>Swap Success Rate</span>
                                        <span>92%</span>
                                      </div>
                                      <div className="progress">
                                        <div className="progress-bar bg-primary" style={{ width: '92%' }}></div>
                                      </div>
                                    </div>
                                    <div className="health-metric">
                                      <div className="d-flex justify-content-between mb-1">
                                        <span>User Satisfaction</span>
                                        <span>95%</span>
                                      </div>
                                      <div className="progress">
                                        <div className="progress-bar bg-info" style={{ width: '95%' }}></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                          
                          <Col md={4}>
                            <Card className="recent-activity-card h-100">
                              <Card.Header>
                                <h5>
                                  <i className="fas fa-bell me-2"></i>
                                  Recent Admin Actions
                                </h5>
                              </Card.Header>
                              <Card.Body>
                                <div className="activity-feed">
                                  <div className="activity-item">
                                    <div className="activity-icon bg-success">
                                      <i className="fas fa-check"></i>
                                    </div>
                                    <div className="activity-content">
                                      <p className="activity-text">Approved 5 skill submissions</p>
                                      <small className="activity-time">2 hours ago</small>
                                    </div>
                                  </div>
                                  
                                  <div className="activity-item">
                                    <div className="activity-icon bg-warning">
                                      <i className="fas fa-flag"></i>
                                    </div>
                                    <div className="activity-content">
                                      <p className="activity-text">Reviewed user report #1234</p>
                                      <small className="activity-time">4 hours ago</small>
                                    </div>
                                  </div>
                                  
                                  <div className="activity-item">
                                    <div className="activity-icon bg-info">
                                      <i className="fas fa-bullhorn"></i>
                                    </div>
                                    <div className="activity-content">
                                      <p className="activity-text">Sent platform announcement</p>
                                      <small className="activity-time">1 day ago</small>
                                    </div>
                                  </div>
                                  
                                  <div className="activity-item">
                                    <div className="activity-icon bg-danger">
                                      <i className="fas fa-ban"></i>
                                    </div>
                                    <div className="activity-content">
                                      <p className="activity-text">Banned user for policy violation</p>
                                      <small className="activity-time">2 days ago</small>
                                    </div>
                                  </div>
                                  
                                  <div className="activity-item">
                                    <div className="activity-icon bg-primary">
                                      <i className="fas fa-download"></i>
                                    </div>
                                    <div className="activity-content">
                                      <p className="activity-text">Generated monthly report</p>
                                      <small className="activity-time">3 days ago</small>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-center mt-3">
                                  <Button variant="outline-primary" size="sm">
                                    View All Activities
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                <Tab.Pane eventKey="skills">
                  <Card className="content-card">
                    <Card.Header className="content-card-header">
                      <h4><i className="fas fa-cogs me-2"></i>Skill Moderation</h4>
                    </Card.Header>
                    <Card.Body>
                      <SkillModerationPanel />
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                <Tab.Pane eventKey="users">
                  <Card className="content-card">
                    <Card.Header className="content-card-header">
                      <h4><i className="fas fa-users me-2"></i>User Management</h4>
                    </Card.Header>
                    <Card.Body>
                      <UserManagementPanel />
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                <Tab.Pane eventKey="swaps">
                  <Card className="content-card">
                    <Card.Header className="content-card-header">
                      <h4><i className="fas fa-exchange-alt me-2"></i>Swap Monitoring</h4>
                    </Card.Header>
                    <Card.Body>
                      <SwapMonitoringPanel />
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                <Tab.Pane eventKey="messages">
                  <Card className="content-card">
                    <Card.Header className="content-card-header">
                      <h4><i className="fas fa-bullhorn me-2"></i>Platform Messages</h4>
                    </Card.Header>
                    <Card.Body>
                      <PlatformMessagingPanel />
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                <Tab.Pane eventKey="reports">
                  <Card className="content-card">
                    <Card.Header className="content-card-header">
                      <h4><i className="fas fa-chart-bar me-2"></i>Reports & Analytics</h4>
                    </Card.Header>
                    <Card.Body>
                      <ReportsPanel />
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
