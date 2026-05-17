import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';
import { getCookie } from 'cookies-next';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

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

// ── helpers ───────────────────────────────────────────────────────────────────

const fmt = (n, decimals = 0) =>
  n == null ? '—' : Number(n).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const fmtMoney = (n) => (n == null ? '—' : `$${fmt(n)}`);
const fmtPct = (n) => (n == null ? '—' : `${fmt(n, 1)}%`);

/** Returns last 12 calendar months (oldest → newest). */
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

// ── chart option factories (stable shape, data injected via series prop) ──────

const makeAreaOptions = (categories) => ({
  chart: { height: 280, type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: { type: 'vertical', opacityFrom: 0.35, opacityTo: 0, stops: [0, 100] },
  },
  colors: ['#7c6af7', '#f472b6'],
  xaxis: {
    categories,
    axisTicks: { show: false },
    axisBorder: { show: false },
  },
  yaxis: { min: 0, axisBorder: { show: false } },
  grid: { strokeDashArray: 3, xaxis: { lines: { show: false } } },
  legend: { show: true, horizontalAlign: 'center', offsetY: 5 },
  tooltip: { shared: true },
});

const DONUT_OPTIONS = {
  chart: { height: 260, type: 'donut' },
  labels: ['Free', 'Trial', 'Premium'],
  colors: ['#8486a7', '#f9b931', '#7c6af7'],
  legend: { show: true, position: 'bottom', offsetY: 5 },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: { show: true, label: 'Total', color: '#5d7186' },
        },
      },
    },
  },
};

// ── sub-components ────────────────────────────────────────────────────────────

const KpiCard = ({ label, value, icon, variant, change, up }) => (
  <Card className="h-100">
    <CardBody>
      <div className="d-flex align-items-start justify-content-between">
        <div
          className={`avatar-md rounded flex-centered bg-${variant} bg-opacity-10`}
          style={{ width: 48, height: 48, flexShrink: 0 }}
        >
          <IconifyIcon icon={icon} height={26} width={26} className={`text-${variant}`} />
        </div>
        <span
          className={`badge bg-${up ? 'success' : 'danger'}-subtle text-${up ? 'success' : 'danger'} fw-semibold`}
          style={{ fontSize: '0.7rem' }}
        >
          {change}
        </span>
      </div>
      <div className="mt-3">
        <h3 className="mb-1 fw-bold">{value}</h3>
        <p className="text-muted mb-0 fs-13">{label}</p>
      </div>
    </CardBody>
  </Card>
);

const SessionsList = ({ title, rows, keyProp, valueProp }) => {
  const max = rows[0]?.[valueProp] || 1;
  return (
    <Card className="h-100">
      <CardHeader className="border-bottom border-dashed">
        <CardTitle className="mb-0">{title}</CardTitle>
      </CardHeader>
      <CardBody>
        {rows.length === 0 ? (
          <p className="text-muted mb-0 text-center">No data</p>
        ) : (
          <ul className="list-unstyled mb-0">
            {rows.map((row, i) => (
              <li key={i} className="mb-2">
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-medium" style={{ fontSize: '0.85rem' }}>
                    {row[keyProp]}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {fmt(row[valueProp])}
                  </span>
                </div>
                <div className="progress" style={{ height: 4 }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${Math.round((row[valueProp] / max) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
};

const planBadge = { free: 'secondary', weekly: 'warning', monthly: 'primary' };
const statusBadge = { active: 'success', canceled: 'danger', past_due: 'warning', trialing: 'info' };

const RecentUsersTable = ({ users }) => (
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
                <td colSpan={5} className="text-center text-muted py-4">
                  No users yet
                </td>
              </tr>
            ) : (
              users.map((u, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle flex-centered bg-primary bg-opacity-10 text-primary fw-bold"
                        style={{ width: 32, height: 32, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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

// ── page ──────────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({ sessionsByCountry: [], sessionsByBrowser: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Overview] useEffect fired, token:', getToken()?.substring(0, 10));
    const token = getToken();
    if (!token) {
      console.warn('[Overview] No token found in cookie — fetch skipped');
      setLoading(false);
      return;
    }
    console.log('[Overview] Fetching admin data...');
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get(`${API_BASE}/admin/stats`, { headers }),
      axios.get(`${API_BASE}/admin/revenue`, { headers }),
      axios.get(`${API_BASE}/admin/users`, { headers }),
      axios.get(`${API_BASE}/admin/analytics`, { headers }),
    ])
      .then(([sRes, rRes, uRes, aRes]) => {
        setStats(sRes.data);
        setRevenue(rRes.data);
        setUsers(uRes.data.users || []);
        setAnalytics(aRes.data);
      })
      .catch((err) => console.error('Admin data fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  // ── derived values ──────────────────────────────────────────────────────────

  const totalPlanUsers = stats
    ? (stats.planDistribution.free + stats.planDistribution.trial + stats.planDistribution.premium) || 1
    : 1;
  const paidPct = stats
    ? ((stats.planDistribution.trial + stats.planDistribution.premium) / totalPlanUsers) * 100
    : null;
  const churnPct = stats
    ? (stats.deactivatedAccounts / (stats.totalUsers + stats.deactivatedAccounts || 1)) * 100
    : null;

  const kpiCards = [
    {
      label: 'MRR',
      value: loading ? '…' : fmtMoney(revenue?.mrr),
      icon: 'iconamoon:cash-duotone',
      variant: 'primary',
      change: 'Monthly',
      up: true,
    },
    {
      label: 'ARR',
      value: loading ? '…' : fmtMoney(revenue?.arr),
      icon: 'iconamoon:calendar-1-duotone',
      variant: 'success',
      change: 'Annual',
      up: true,
    },
    {
      label: 'Active Users',
      value: loading ? '…' : fmt(stats?.totalUsers),
      icon: 'iconamoon:profile-circle-duotone',
      variant: 'info',
      change: `${fmt(stats?.activeSubscriptions ?? 0)} paid`,
      up: true,
    },
    {
      label: 'New This Month',
      value: loading ? '…' : fmt(stats?.newUsersThisMonth),
      icon: 'iconamoon:star-duotone',
      variant: 'warning',
      change: 'This month',
      up: true,
    },
    {
      label: 'Churn Rate',
      value: loading ? '…' : fmtPct(churnPct),
      icon: 'iconamoon:trend-down-bold',
      variant: 'danger',
      change: 'All-time',
      up: false,
    },
    {
      label: 'Paid Users',
      value: loading ? '…' : fmtPct(paidPct),
      icon: 'iconamoon:diamond-duotone',
      variant: 'pink',
      change: 'of total',
      up: true,
    },
  ];

  // ── chart series ────────────────────────────────────────────────────────────

  const areaCategories = LAST_12.map((m) => m.label);

  const areaSeries = useMemo(() => {
    if (!stats) return [{ name: 'Free Users', data: [] }, { name: 'Paid Users', data: [] }];
    const lookup = {};
    for (const item of stats.newUsersLast12Months || []) {
      lookup[`${item.year}-${item.month}`] = item;
    }
    return [
      {
        name: 'Free Users',
        data: LAST_12.map((m) => lookup[`${m.year}-${m.month}`]?.free ?? 0),
      },
      {
        name: 'Paid Users',
        data: LAST_12.map((m) => lookup[`${m.year}-${m.month}`]?.paid ?? 0),
      },
    ];
  }, [stats]);

  const donutSeries = stats
    ? [stats.planDistribution.free, stats.planDistribution.trial, stats.planDistribution.premium]
    : [0, 0, 0];

  const donutPercentages = useMemo(
    () => [
      { label: 'Free', color: '#8486a7', pct: fmtPct((donutSeries[0] / totalPlanUsers) * 100) },
      { label: 'Trial', color: '#f9b931', pct: fmtPct((donutSeries[1] / totalPlanUsers) * 100) },
      { label: 'Premium', color: '#7c6af7', pct: fmtPct((donutSeries[2] / totalPlanUsers) * 100) },
    ],
    [donutSeries, totalPlanUsers]
  );

  const areaOptions = useMemo(() => makeAreaOptions(areaCategories), []);

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <PageMetaData title="Overview" />
      <PageBreadcrumb title="Overview" subName="Dashboard" />

      {/* KPI row */}
      <Row className="g-3 mb-3">
        {kpiCards.map((card, idx) => (
          <Col xs={12} sm={6} xl={4} xxl={2} key={idx}>
            <KpiCard {...card} />
          </Col>
        ))}
      </Row>

      {/* Charts row */}
      <Row className="g-3 mb-3">
        <Col xl={8}>
          <Card>
            <CardHeader className="border-bottom border-dashed d-flex align-items-center">
              <CardTitle className="mb-0">Users Over Time</CardTitle>
              {loading && <Spinner size="sm" className="ms-2" />}
            </CardHeader>
            <CardBody>
              <ReactApexChart
                options={areaOptions}
                series={areaSeries}
                type="area"
                height={280}
                className="apex-charts"
              />
            </CardBody>
          </Card>
        </Col>

        <Col xl={4}>
          <Card>
            <CardHeader className="border-bottom border-dashed d-flex align-items-center">
              <CardTitle className="mb-0">Users by Plan</CardTitle>
              {loading && <Spinner size="sm" className="ms-2" />}
            </CardHeader>
            <CardBody>
              <ReactApexChart
                options={DONUT_OPTIONS}
                series={donutSeries}
                type="donut"
                height={260}
                className="apex-charts"
              />
              <div className="d-flex justify-content-around mt-2">
                {donutPercentages.map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="fw-semibold" style={{ color: item.color }}>
                      {item.pct}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Sessions row */}
      <Row className="g-3 mb-3">
        <Col xl={6}>
          <SessionsList
            title="Sessions by Country (last 30 days)"
            rows={analytics.sessionsByCountry}
            keyProp="country"
            valueProp="sessions"
          />
        </Col>
        <Col xl={6}>
          <SessionsList
            title="Sessions by Browser (last 30 days)"
            rows={analytics.sessionsByBrowser}
            keyProp="browser"
            valueProp="sessions"
          />
        </Col>
      </Row>

      {/* Recent users table */}
      <Row>
        <Col xs={12}>
          <RecentUsersTable users={users} />
        </Col>
      </Row>
    </>
  );
}
