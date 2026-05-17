import { useEffect, useState } from 'react';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Spinner } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';

const API_BASE = 'https://api.3dmock.app/api';
const AUTH_KEY = '_REBACK_AUTH_KEY_';

const getToken = () => {
  try {
    const raw = getCookie(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw.toString()).token ?? null;
  } catch {
    return null;
  }
};

const SOURCE_COLORS = {
  'Organic Search': '#ac61c7',
  'Direct': '#e76aaa',
  'Referral': '#ea8377',
  'Organic Social': '#af73a7',
  'Paid Search': '#dba0d1',
  'Email': '#f7a79a',
  'Paid Social': '#b76ba8',
  'Unassigned': '#d3d3d3',
};

const DEFAULT_COLOR = '#8486a7';

const UsersPage = () => {
  const [trafficSource, setTrafficSource] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    const headers = { Authorization: `Bearer ${token}` };
    axios.get(`${API_BASE}/admin/analytics`, { headers })
      .then((res) => {
        setTrafficSource(res.data?.trafficSource || []);
      })
      .catch((err) => console.error('Traffic source fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const max = trafficSource[0]?.sessions || 1;

  return (
    <>
      <PageBreadcrumb subName="Dashboards" title="Traffic Sources" />
      <PageMetaData title="Traffic Sources" />

      <Row className="g-3 mb-3">
        {loading ? (
          <Col xs={12} className="text-center py-5">
            <Spinner />
          </Col>
        ) : trafficSource.length === 0 ? (
          <Col xs={12}>
            <Card>
              <CardBody className="text-center text-muted py-5">
                No traffic source data yet
              </CardBody>
            </Card>
          </Col>
        ) : (
          trafficSource.map((item, idx) => {
            const color = SOURCE_COLORS[item.source] ?? DEFAULT_COLOR;
            return (
              <Col xs={12} sm={6} xl={3} key={idx}>
                <Card className="h-100">
                  <CardBody>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span
                        style={{
                          width: 10, height: 10, borderRadius: '50%',
                          backgroundColor: color, flexShrink: 0,
                        }}
                      />
                      <span className="fw-semibold text-muted fs-13">{item.source}</span>
                    </div>
                    <h3 className="fw-bold mb-1">{item.sessions.toLocaleString()}</h3>
                    <p className="text-muted fs-12 mb-3">sessions</p>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fs-12 text-muted">Share</span>
                      <span className="fs-12 fw-semibold">{item.percentage}%</span>
                    </div>
                    <div className="progress" style={{ height: 6 }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.round((item.sessions / max) * 100)}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            );
          })
        )}
      </Row>

      {!loading && trafficSource.length > 0 && (
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader className="border-bottom border-dashed">
                <CardTitle className="mb-0">Traffic Breakdown</CardTitle>
              </CardHeader>
              <CardBody>
                {trafficSource.map((item, idx) => {
                  const color = SOURCE_COLORS[item.source] ?? DEFAULT_COLOR;
                  return (
                    <div key={idx} className={idx < trafficSource.length - 1 ? 'mb-4' : ''}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="d-flex align-items-center gap-2">
                          <span
                            style={{
                              width: 8, height: 8, borderRadius: '50%',
                              backgroundColor: color, flexShrink: 0,
                            }}
                          />
                          <span className="fw-medium fs-13">{item.source}</span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <span className="text-muted fs-13">{item.sessions.toLocaleString()} sessions</span>
                          <span
                            className="badge fw-semibold"
                            style={{ backgroundColor: color + '22', color }}
                          >
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="progress" style={{ height: 8 }}>
                        <div
                          className="progress-bar"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default UsersPage;
