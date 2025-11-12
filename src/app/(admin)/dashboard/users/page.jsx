import { Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import Accounts from './components/Accounts';
import OverviewChart from './components/OverviewChart';
import RecentOrders from './components/RecentOrders';
import SalesByCategory from './components/SalesByCategory';
import Stats from './components/Stats';
import Transactions from './components/Transactions';
import InvoicesList from './components/InvoicesList';
import PageMetaData from '@/components/PageTitle';
import SessionsByCountry from '../analytics/components/SessionsByCountry';
import SessionByBrowser from '../analytics/components/SessionByBrowser';
import TopPages from '../analytics/components/TopPages';

const UsersPage = () => {
  return <>
      <PageBreadcrumb subName="Dashboards" title="Users KPI's" />
      <PageMetaData title="Users KPI's" />

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
          {/* <SessionsByCountry /> */}
        </Col>
      </Row>
      <Row>
        {/* <Col xl={6}>
          <SessionByBrowser />

        </Col>
        <Col xl={6}>
          <TopPages />
          
        </Col> */}
      </Row>
      <Row>
        <Col>
          <InvoicesList />
        </Col>
      </Row>
    </>;
};
export default UsersPage;