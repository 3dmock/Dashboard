import { WorldVectorMap } from '@/components/VectorMap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Fragment } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, ProgressBar, Row } from 'react-bootstrap';
import { countries } from '../data';

const VARIANTS = ['primary', 'success', 'info', 'warning', 'danger'];

const SessionsByCountry = ({ countriesData }) => {
  const options = {
    map: 'world',
    zoomOnScroll: true,
    zoomButtons: false,
    markersSelectable: true,
    markers: [
      { name: 'Canada', coords: [56.1304, -106.3468] },
      { name: 'Brazil', coords: [-14.235, -51.9253] },
      { name: 'Russia', coords: [61, 105] },
      { name: 'China', coords: [35.8617, 104.1954] },
      { name: 'United States', coords: [37.0902, -95.7129] },
    ],
    markerStyle: {
      initial: { fill: '#7f56da' },
      selected: { fill: '#22c55e' },
    },
    labels: { markers: { render: (marker) => marker.name } },
    regionStyle: { initial: { fill: 'rgba(169,183,197, 0.3)', fillOpacity: 1 } },
  };

  const isApiData = !!countriesData;
  const list = countriesData ?? countries;
  const max = isApiData ? list[0]?.sessions || 1 : 1;

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center border-bottom border-dashed">
        <CardTitle>Sessions by Country</CardTitle>
        <Dropdown>
          <DropdownToggle as={'a'} role="button" className="arrow-none btn btn-sm btn-outline-light icons-center gap-2">
            View Data <IconifyIcon icon="bx:chevron-down" className="fs-16" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem href="">Download</DropdownItem>
            <DropdownItem href="">Export</DropdownItem>
            <DropdownItem href="">Import</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
      <CardBody className="py-0">
        <Row className="align-items-center">
          <Col lg={7}>
            <div id="world-map-markers" className="my-3">
              <WorldVectorMap height="300px" width="100%" options={options} />
            </div>
          </Col>
          <Col lg={5} dir="ltr">
            <div className="p-3">
              {list.map((item, idx) => (
                <Fragment key={idx}>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-1">
                      {!isApiData && (
                        <IconifyIcon icon={item.icon} className="fs-16 align-middle me-1" />
                      )}
                      <span className="align-middle">{isApiData ? item.country : item.name}</span>
                    </p>
                  </div>
                  <Row className={`align-items-center ${list.length - 1 === idx ? '' : 'mb-3'}`}>
                    <Col>
                      <ProgressBar
                        variant={isApiData ? VARIANTS[idx % 5] : item.variant}
                        now={isApiData ? Math.round((item.sessions / max) * 100) : item.value}
                        className="progress progress-soft progress-sm"
                      />
                    </Col>
                    <Col xs="auto">
                      <p className="mb-0 fs-13 fw-semibold">
                        {isApiData ? item.sessions.toLocaleString() : `${item.amount}k`}
                      </p>
                    </Col>
                  </Row>
                </Fragment>
              ))}
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default SessionsByCountry;
