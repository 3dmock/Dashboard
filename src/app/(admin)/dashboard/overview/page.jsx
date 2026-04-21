import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table, Badge } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

// ─── KPI data ────────────────────────────────────────────────────────────────
const kpiCards = [
  {
    label: 'MRR',
    value: '$0',
    icon: 'iconamoon:cash-duotone',
    variant: 'primary',
    change: '+0%',
    up: true,
  },
  {
    label: 'ARR',
    value: '$0',
    icon: 'iconamoon:calendar-1-duotone',
    variant: 'success',
    change: '+0%',
    up: true,
  },
  {
    label: 'Active Users',
    value: '0',
    icon: 'iconamoon:profile-circle-duotone',
    variant: 'info',
    change: '+0%',
    up: true,
  },
  {
    label: 'New This Month',
    value: '0',
    icon: 'iconamoon:star-duotone',
    variant: 'warning',
    change: '+0%',
    up: true,
  },
  {
    label: 'Churn Rate',
    value: '0%',
    icon: 'iconamoon:trend-down-bold',
    variant: 'danger',
    change: '0%',
    up: false,
  },
  {
    label: 'Free vs Paid',
    value: '0%',
    icon: 'iconamoon:diamond-duotone',
    variant: 'pink',
    change: '0%',
    up: true,
  },
];

// ─── Mock users ───────────────────────────────────────────────────────────────
const recentUsers = [
  { name: 'Alex Martin',    email: 'alex@example.com',   plan: 'Free',    joined: '2024-12-01', status: 'Active' },
  { name: 'Sara Johnson',   email: 'sara@example.com',   plan: 'Pro',     joined: '2024-12-08', status: 'Active' },
  { name: 'James Lee',      email: 'james@example.com',  plan: 'Trial',   joined: '2025-01-03', status: 'Trial'  },
  { name: 'Maria Garcia',   email: 'maria@example.com',  plan: 'Pro',     joined: '2025-01-15', status: 'Active' },
  { name: 'Tom Williams',   email: 'tom@example.com',    plan: 'Free',    joined: '2025-02-01', status: 'Inactive'},
];

const planBadgeVariant = { Free: 'secondary', Pro: 'primary', Trial: 'warning' };
const statusBadgeVariant = { Active: 'success', Trial: 'warning', Inactive: 'danger' };

// ─── Chart configs ────────────────────────────────────────────────────────────
const usersOverTimeOptions = {
  chart: { height: 280, type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: { type: 'vertical', opacityFrom: 0.35, opacityTo: 0, stops: [0, 100] },
  },
  colors: ['#7c6af7', '#f472b6'],
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    axisTicks: { show: false },
    axisBorder: { show: false },
  },
  yaxis: { min: 0, axisBorder: { show: false } },
  grid: { strokeDashArray: 3, xaxis: { lines: { show: false } } },
  legend: { show: true, horizontalAlign: 'center', offsetY: 5 },
  tooltip: { shared: true },
  series: [
    { name: 'Free Users',  data: [12, 18, 14, 22, 28, 35, 30, 42, 48, 52, 58, 65] },
    { name: 'Paid Users',  data: [2,  4,  3,  6,  8,  10, 9,  14, 17, 20, 24, 30] },
  ],
};

const planDonutOptions = {
  chart: { height: 260, type: 'donut' },
  labels: ['Free', 'Trial', 'Premium'],
  colors: ['#8486a7', '#f9b931', '#7c6af7'],
  legend: { show: true, position: 'bottom', offsetY: 5 },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: { donut: { size: '70%', labels: { show: true, total: { show: true, label: 'Total', color: '#5d7186' } } } },
  },
  series: [60, 25, 15],
};

// ─── Sub-components ───────────────────────────────────────────────────────────
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

const UsersOverTimeChart = () => (
  <Card>
    <CardHeader className="border-bottom border-dashed d-flex align-items-center">
      <CardTitle className="mb-0">Users Over Time</CardTitle>
    </CardHeader>
    <CardBody>
      <ReactApexChart
        options={usersOverTimeOptions}
        series={usersOverTimeOptions.series}
        type="area"
        height={280}
        className="apex-charts"
      />
    </CardBody>
  </Card>
);

const PlanDonutChart = () => (
  <Card>
    <CardHeader className="border-bottom border-dashed d-flex align-items-center">
      <CardTitle className="mb-0">Users by Plan</CardTitle>
    </CardHeader>
    <CardBody>
      <ReactApexChart
        options={planDonutOptions}
        series={planDonutOptions.series}
        type="donut"
        height={260}
        className="apex-charts"
      />
      <div className="d-flex justify-content-around mt-2">
        {[
          { label: 'Free',    value: '60%', color: '#8486a7' },
          { label: 'Trial',   value: '25%', color: '#f9b931' },
          { label: 'Premium', value: '15%', color: '#7c6af7' },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="fw-semibold" style={{ color: item.color }}>{item.value}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{item.label}</div>
          </div>
        ))}
      </div>
    </CardBody>
  </Card>
);

const RecentUsersTable = () => (
  <Card>
    <CardHeader className="border-bottom border-dashed d-flex align-items-center">
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
            {recentUsers.map((user, idx) => (
              <tr key={idx}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="avatar-xs rounded-circle flex-centered bg-primary bg-opacity-10 text-primary fw-bold"
                      style={{ width: 32, height: 32, fontSize: 13 }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <span className="fw-medium">{user.name}</span>
                  </div>
                </td>
                <td className="text-muted">{user.email}</td>
                <td>
                  <Badge bg={planBadgeVariant[user.plan] ?? 'secondary'} className="fw-medium">
                    {user.plan}
                  </Badge>
                </td>
                <td className="text-muted">{user.joined}</td>
                <td>
                  <Badge
                    bg={`${statusBadgeVariant[user.status] ?? 'secondary'}-subtle`}
                    className={`text-${statusBadgeVariant[user.status] ?? 'secondary'} fw-medium`}
                    style={{ fontSize: '0.75rem' }}
                  >
                    {user.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </CardBody>
  </Card>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OverviewPage() {
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
          <UsersOverTimeChart />
        </Col>
        <Col xl={4}>
          <PlanDonutChart />
        </Col>
      </Row>

      {/* Recent users table */}
      <Row>
        <Col xs={12}>
          <RecentUsersTable />
        </Col>
      </Row>
    </>
  );
}
