import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import OverviewChart from './components/OverviewChart';
import SalesByCategory from './components/SalesByCategory';
import Stats from './components/Stats';
import SessionsByCountry from '../analytics/components/SessionsByCountry';
import SessionByBrowser from '../analytics/components/SessionByBrowser';
import TopPages from '../analytics/components/TopPages';

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

const SalesPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
    planDistribution: { free: 0, trial: 0, premium: 0 },
    activeSubscriptions: 0,
    deactivatedAccounts: 0,
    newUsersLast12Months: [],
  });
  const [revenue, setRevenue] = useState({ mrr: 0, arr: 0, revenueHistory: [] });
  const [analytics, setAnalytics] = useState({ sessionsByCountry: [], sessionsByBrowser: [], topPages: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get(`${API_BASE}/admin/stats`, { headers }),
      axios.get(`${API_BASE}/admin/revenue`, { headers }),
      axios.get(`${API_BASE}/admin/analytics`, { headers }),
    ])
      .then(([sRes, rRes, aRes]) => {
        setStats((prev) => ({ ...prev, ...sRes.data }));
        setRevenue((prev) => ({ ...prev, ...rRes.data }));
        setAnalytics((prev) => ({ ...prev, ...aRes.data }));
      })
      .catch((err) => console.error('Sales data fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const churnPct = (((stats.deactivatedAccounts || 0) / ((stats.totalUsers + (stats.deactivatedAccounts || 0)) || 1)) * 100).toFixed(1);

  const statsData = [
    {
      icon: 'iconamoon:shopping-card-add-duotone',
      iconColor: 'info',
      amount: loading ? '…' : fmt(revenue?.mrr),
      title: 'MRR',
      change: '0',
      changeColor: 'success',
      badgeIcon: 'bx:doughnut-chart',
      prefix: '$',
      suffix: '',
    },
    {
      icon: 'iconamoon:link-external-duotone',
      iconColor: 'success',
      amount: loading ? '…' : fmt(revenue?.arr),
      title: 'ARR',
      change: '0',
      changeColor: 'success',
      badgeIcon: 'bx:bar-chart-alt-2',
      prefix: '$',
      suffix: '',
    },
    {
      icon: 'iconamoon:store-duotone',
      iconColor: 'purple',
      amount: loading ? '…' : fmt(stats?.totalUsers),
      title: 'ACTIVE USERS',
      change: '0',
      changeColor: 'success',
      badgeIcon: 'bx:building-house',
      prefix: '',
      suffix: '',
    },
    {
      icon: 'iconamoon:gift-duotone',
      iconColor: 'orange',
      amount: loading ? '…' : fmt(stats?.newUsersThisMonth),
      title: 'NEW THIS MONTH',
      change: '0',
      changeColor: 'success',
      badgeIcon: 'bx:bowl-hot',
      prefix: '',
      suffix: '',
    },
    {
      icon: 'iconamoon:certificate-badge-duotone',
      iconColor: 'warning',
      amount: loading ? '…' : churnPct,
      title: 'CHURN RATE',
      change: '0',
      changeColor: 'danger',
      badgeIcon: 'bx:cricket-ball',
      prefix: '',
      suffix: '%',
    },
    {
      icon: 'iconamoon:certificate-badge-duotone',
      iconColor: 'danger',
      amount: loading ? '…' : fmt(stats?.activeSubscriptions),
      title: 'PAID SUBS',
      change: '0',
      changeColor: 'success',
      badgeIcon: 'bx:line-chart',
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

  const donutSeries = [
    (stats?.planDistribution?.trial || 0) + (stats?.planDistribution?.premium || 0),
    stats?.planDistribution?.free || 0,
  ];

  const countryData = analytics?.sessionsByCountry?.length ? analytics.sessionsByCountry : undefined;
  const browserData = analytics?.sessionsByBrowser?.length ? analytics.sessionsByBrowser : undefined;

  return (
    <>
      <PageBreadcrumb subName="Dashboards" title="KPI's" />
      <PageMetaData title="Sales" />

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
          <SessionsByCountry countriesData={countryData} />
        </Col>
      </Row>

      <Row>
        <Col xl={6}>
          <SessionByBrowser browsersData={browserData} />
        </Col>
        <Col xl={6}>
          <TopPages pagesData={analytics.topPages} />
        </Col>
      </Row>
    </>
  );
};

export default SalesPage;
