import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { Badge, Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import OverviewChart from './components/OverviewChart';
import SalesByCategory from './components/SalesByCategory';
import Stats from './components/Stats';

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

const getLast12Months = () => {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: d.toLocaleString('default', { month: 'short' }),
    });
  }
  return months;
};

const LAST_12 = getLast12Months();

const fmt = (n) => (n == null ? '0' : Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 }));

const planBadge = { free: 'secondary', weekly: 'warning', monthly: 'primary' };
const statusBadge = { active: 'success', canceled: 'danger', past_due: 'warning', trialing: 'info' };

const UsersTable = ({ users }) => (
  <Card>
    <CardHeader className="border-bottom border-dashed">
      <CardTitle className="mb-0">Recent Users</CardTitle>
    </CardHeader>
    <CardBody className="p-0">
      <div className="table-responsive">
        <Table className="table-centered table-nowrap mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Joined</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">No users yet</td>
              </tr>
            ) : (
              users.map((u, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold"
                        style={{ width: 32, height: 32, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                      >
                        {(u.name || u.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <span className="fw-medium">{u.name || '—'}</span>
                    </div>
                  </td>
                  <td className="text-muted">{u.email}</td>
                  <td>
                    <Badge bg={planBadge[u.currentPlan] ?? 'secondary'} className="fw-medium text-capitalize">
                      {u.currentPlan || 'free'}
                    </Badge>
                  </td>
                  <td className="text-muted">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <Badge
                      bg={`${statusBadge[u.subscriptionStatus] ?? 'secondary'}-subtle`}
                      className={`text-${statusBadge[u.subscriptionStatus] ?? 'secondary'} fw-medium text-capitalize`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {u.subscriptionStatus || 'free'}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </CardBody>
  </Card>
);

const UsersPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
    planDistribution: { free: 0, trial: 0, premium: 0 },
    activeSubscriptions: 0,
    deactivatedAccounts: 0,
    newUsersLast12Months: [],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get(`${API_BASE}/admin/stats`, { headers }),
      axios.get(`${API_BASE}/admin/users`, { headers }),
    ])
      .then(([sRes, uRes]) => {
        setStats((prev) => ({ ...prev, ...sRes.data }));
        setUsers(uRes.data?.users || []);
      })
      .catch((err) => console.error('Users data fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const paidCount = (stats?.planDistribution?.trial || 0) + (stats?.planDistribution?.premium || 0);
  const totalPlan = ((stats?.planDistribution?.free || 0) + paidCount) || 1;
  const conversionPct = ((paidCount / totalPlan) * 100).toFixed(1);

  const statsData = [
    {
      icon: 'iconamoon:shopping-card-add-duotone',
      iconColor: 'info',
      amount: loading ? '…' : fmt(stats?.totalUsers),
      title: 'TOTAL USERS',
      change: '0',
      changeColor: 'success',
      badgeIcon: 'bx:doughnut-chart',
      prefix: '',
      suffix: '',
    },
    {
      icon: 'iconamoon:link-external-duotone',
      iconColor: 'success',
      amount: loading ? '…' : fmt(stats?.planDistribution?.trial),
      title: 'TRIAL PLAN',
      change: '0',
      changeColor: 'success',
      badgeIcon: 'bx:bar-chart-alt-2',
      prefix: '',
      suffix: '',
    },
    {
      icon: 'iconamoon:store-duotone',
      iconColor: 'purple',
      amount: loading ? '…' : fmt(stats?.planDistribution?.premium),
      title: 'PREMIUM PLAN',
      change: '0',
      changeColor: 'success',
      badgeIcon: 'bx:building-house',
      prefix: '',
      suffix: '',
    },
    {
      icon: 'iconamoon:gift-duotone',
      iconColor: 'orange',
      amount: loading ? '…' : conversionPct,
      title: 'CONVERSION',
      change: '0',
      changeColor: 'success',
      badgeIcon: 'bx:bowl-hot',
      prefix: '',
      suffix: '%',
    },
    {
      icon: 'iconamoon:certificate-badge-duotone',
      iconColor: 'warning',
      amount: loading ? '…' : fmt(stats?.deactivatedAccounts),
      title: 'CHURNED',
      change: '0',
      changeColor: 'danger',
      badgeIcon: 'bx:cricket-ball',
      prefix: '',
      suffix: '',
    },
  ];

  const areaCategories = LAST_12.map((m) => m.label);

  const areaSeries = useMemo(() => {
    const lookup = {};
    for (const item of stats?.newUsersLast12Months || []) {
      lookup[`${item.year}-${item.month}`] = item;
    }
    return [
      { name: 'Free Users', type: 'area', data: LAST_12.map((m) => lookup[`${m.year}-${m.month}`]?.free ?? 0) },
      { name: 'Paid Users', type: 'line', data: LAST_12.map((m) => lookup[`${m.year}-${m.month}`]?.paid ?? 0) },
    ];
  }, [stats]);

  const donutSeries = [paidCount, stats?.planDistribution?.free || 0];

  return (
    <>
      <PageBreadcrumb subName="Dashboards" title="Users KPI's" />
      <PageMetaData title="Users KPI's" />

      <Stats statsData={statsData} />

      <Row>
        <Col xxl={8} xl={8} lg={7} md={12}>
          <OverviewChart series={areaSeries} categories={areaCategories} />
        </Col>
        <Col xxl={4} xl={4} lg={5} md={12}>
          <SalesByCategory donutSeries={donutSeries} donutLabels={['Paying', 'Free']} />
        </Col>
      </Row>

      <Row>
        <Col>
          <UsersTable users={users} />
        </Col>
      </Row>
    </>
  );
};

export default UsersPage;
