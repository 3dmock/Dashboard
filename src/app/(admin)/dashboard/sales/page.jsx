import { Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import Accounts from './components/Accounts';
import OverviewChart from './components/OverviewChart';
import RecentOrders from './components/RecentOrders';
import SalesByCategory from './components/SalesByCategory';
import Stats from './components/Stats';
import Transactions from './components/Transactions';
import PageMetaData from '@/components/PageTitle';
import SessionsByCountry from '../analytics/components/SessionsByCountry';
import SessionByBrowser from '../analytics/components/SessionByBrowser';
import TopPages from '../analytics/components/TopPages';

const SalesPage = () => {
  return <>
      <PageBreadcrumb subName="Dashboards" title="KPI's" />
      <PageMetaData title="Sales" />

      <Stats />
      <Row>
        <Col xxl={8} xl={8} lg={7} md={12}>
          <OverviewChart />
        </Col>
        <Col xxl={4} xl={4} lg={5} md={12}>
          <SalesByCategory />
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <RecentOrders /> */}
          <SessionsByCountry />
        </Col>
      </Row>
      <Row>
        <Col xl={6}>
          {/* <Accounts /> */}
          <SessionByBrowser />

        </Col>
        <Col xl={6}>
          {/* <Transactions /> */}
          <TopPages />
          
        </Col>
      </Row>
    </>;
};
export default SalesPage;