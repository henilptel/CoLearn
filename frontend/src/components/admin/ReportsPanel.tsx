import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Table, Row, Col, Form, Badge } from 'react-bootstrap';

interface ReportData {
  userActivity: {
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    userGrowthRate: number;
  };
  swapStats: {
    totalSwaps: number;
    completedSwaps: number;
    successRate: number;
    averageRating: number;
  };
  feedbackStats: {
    totalFeedback: number;
    averageRating: number;
    positivePercentage: number;
    negativePercentage: number;
  };
  skillStats: {
    totalSkills: number;
    topCategories: Array<{ name: string; count: number }>;
    pendingApprovals: number;
  };
}

interface ExportableReport {
  id: string;
  name: string;
  description: string;
  type: 'USER_ACTIVITY' | 'SWAP_ANALYTICS' | 'FEEDBACK_LOGS' | 'SKILL_REPORTS' | 'FULL_REPORT';
  icon: string;
}

const ReportsPanel: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
    endDate: new Date().toISOString().split('T')[0]
  });

  const availableReports: ExportableReport[] = [
    {
      id: 'user_activity',
      name: 'User Activity Report',
      description: 'Comprehensive report on user registrations, activity levels, and engagement metrics',
      type: 'USER_ACTIVITY',
      icon: 'users'
    },
    {
      id: 'swap_analytics',
      name: 'Swap Analytics Report',
      description: 'Detailed analytics on skill swaps, success rates, and completion statistics',
      type: 'SWAP_ANALYTICS',
      icon: 'exchange-alt'
    },
    {
      id: 'feedback_logs',
      name: 'Feedback & Ratings Report',
      description: 'User feedback, ratings distribution, and satisfaction metrics',
      type: 'FEEDBACK_LOGS',
      icon: 'star'
    },
    {
      id: 'skill_reports',
      name: 'Skills Analysis Report',
      description: 'Skill categories, trending skills, and moderation statistics',
      type: 'SKILL_REPORTS',
      icon: 'cogs'
    },
    {
      id: 'full_report',
      name: 'Complete Platform Report',
      description: 'Comprehensive report including all metrics and analytics',
      type: 'FULL_REPORT',
      icon: 'file-alt'
    }
  ];

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Mock data for now
      const mockData: ReportData = {
        userActivity: {
          totalUsers: 1247,
          activeUsers: 892,
          newUsersThisMonth: 156,
          userGrowthRate: 12.5
        },
        swapStats: {
          totalSwaps: 3456,
          completedSwaps: 2987,
          successRate: 86.4,
          averageRating: 4.2
        },
        feedbackStats: {
          totalFeedback: 2987,
          averageRating: 4.2,
          positivePercentage: 78.5,
          negativePercentage: 8.2
        },
        skillStats: {
          totalSkills: 5678,
          topCategories: [
            { name: 'Technology', count: 1234 },
            { name: 'Design', count: 987 },
            { name: 'Language', count: 756 },
            { name: 'Business', count: 543 },
            { name: 'Music', count: 432 }
          ],
          pendingApprovals: 23
        }
      };

      setReportData(mockData);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setAlert({ type: 'danger', message: 'Failed to fetch report data' });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (reportType: string) => {
    try {
      setIsExporting(reportType);
      
      // TODO: API call to generate and download report
      console.log('Exporting report:', reportType, dateRange);
      
      // Mock file download
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const report = availableReports.find(r => r.id === reportType);
      setAlert({ 
        type: 'success', 
        message: `${report?.name} has been generated and downloaded successfully!` 
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      setAlert({ type: 'danger', message: 'Failed to export report' });
    } finally {
      setIsExporting(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-panel">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="fas fa-file-download me-2" style={{ color: '#667eea' }}></i>
          Reports & Analytics
        </h3>
      </div>

      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      {/* Date Range Filter */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-calendar-alt me-2"></i>
            Report Parameters
          </h5>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>&nbsp;</Form.Label>
                <Button
                  variant="outline-primary"
                  onClick={fetchReportData}
                  className="w-100"
                >
                  <i className="fas fa-sync me-1"></i>
                  Refresh Data
                </Button>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Analytics Overview */}
      {reportData && (
        <>
          <Row className="mb-4">
            <Col md={3}>
              <Card className="stats-card text-center">
                <Card.Body>
                  <div className="stats-icon mb-2">
                    <i className="fas fa-users" style={{ color: '#667eea', fontSize: '2rem' }}></i>
                  </div>
                  <h3 className="stats-number">{reportData.userActivity.totalUsers.toLocaleString()}</h3>
                  <p className="stats-label text-muted">Total Users</p>
                  <Badge bg="success">+{reportData.userActivity.userGrowthRate}%</Badge>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stats-card text-center">
                <Card.Body>
                  <div className="stats-icon mb-2">
                    <i className="fas fa-exchange-alt" style={{ color: '#28a745', fontSize: '2rem' }}></i>
                  </div>
                  <h3 className="stats-number">{reportData.swapStats.totalSwaps.toLocaleString()}</h3>
                  <p className="stats-label text-muted">Total Swaps</p>
                  <Badge bg="info">{reportData.swapStats.successRate}% Success</Badge>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stats-card text-center">
                <Card.Body>
                  <div className="stats-icon mb-2">
                    <i className="fas fa-star" style={{ color: '#ffc107', fontSize: '2rem' }}></i>
                  </div>
                  <h3 className="stats-number">{reportData.feedbackStats.averageRating.toFixed(1)}</h3>
                  <p className="stats-label text-muted">Avg Rating</p>
                  <Badge bg="warning">{reportData.feedbackStats.positivePercentage}% Positive</Badge>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stats-card text-center">
                <Card.Body>
                  <div className="stats-icon mb-2">
                    <i className="fas fa-cogs" style={{ color: '#17a2b8', fontSize: '2rem' }}></i>
                  </div>
                  <h3 className="stats-number">{reportData.skillStats.totalSkills.toLocaleString()}</h3>
                  <p className="stats-label text-muted">Total Skills</p>
                  <Badge bg="warning">{reportData.skillStats.pendingApprovals} Pending</Badge>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Top Skills Categories */}
          <Row className="mb-4">
            <Col md={8}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="fas fa-chart-bar me-2"></i>
                    Top Skill Categories
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Skills Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.skillStats.topCategories.map((category, index) => {
                        const percentage = ((category.count / reportData.skillStats.totalSkills) * 100).toFixed(1);
                        return (
                          <tr key={index}>
                            <td>
                              <Badge bg="primary" className="me-2">{index + 1}</Badge>
                              {category.name}
                            </td>
                            <td>{category.count.toLocaleString()}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div 
                                  className="progress me-2" 
                                  style={{ width: '100px', height: '20px' }}
                                >
                                  <div 
                                    className="progress-bar bg-primary" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                {percentage}%
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="fas fa-chart-pie me-2"></i>
                    Quick Stats
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Active Users</span>
                      <strong>{reportData.userActivity.activeUsers.toLocaleString()}</strong>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar bg-success" 
                        style={{ 
                          width: `${(reportData.userActivity.activeUsers / reportData.userActivity.totalUsers) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Completed Swaps</span>
                      <strong>{reportData.swapStats.completedSwaps.toLocaleString()}</strong>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar bg-info" 
                        style={{ 
                          width: `${(reportData.swapStats.completedSwaps / reportData.swapStats.totalSwaps) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="d-flex justify-content-between">
                      <span>Positive Feedback</span>
                      <strong>{reportData.feedbackStats.positivePercentage}%</strong>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar bg-warning" 
                        style={{ width: `${reportData.feedbackStats.positivePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Export Reports */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-download me-2"></i>
            Download Reports
          </h5>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            {availableReports.map((report) => (
              <Col md={6} lg={4} key={report.id}>
                <Card className="h-100 border-2">
                  <Card.Body className="text-center">
                    <div className="mb-3">
                      <i 
                        className={`fas fa-${report.icon}`} 
                        style={{ color: '#667eea', fontSize: '2.5rem' }}
                      ></i>
                    </div>
                    <h6 className="card-title">{report.name}</h6>
                    <p className="card-text text-muted small">
                      {report.description}
                    </p>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => exportReport(report.id)}
                      disabled={isExporting === report.id}
                      className="w-100"
                    >
                      {isExporting === report.id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Generating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-download me-2"></i>
                          Download
                        </>
                      )}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ReportsPanel;
