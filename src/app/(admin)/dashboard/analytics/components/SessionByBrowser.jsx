import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { browsers } from '../data';
import { Card, CardBody, CardHeader, CardTitle, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';

const SessionByBrowser = ({ browsersData }) => {
  const isApiData = !!browsersData;
  const list = browsersData ?? browsers;
  const max = isApiData ? list[0]?.sessions || 1 : 1;

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center border-bottom border-dashed">
        <CardTitle>Session By Browser</CardTitle>
        <Dropdown>
          <DropdownToggle as={'a'} role="button" className="arrow-none card-drop">
            <IconifyIcon icon="iconamoon:menu-kebab-vertical-circle-duotone" className="fs-20 align-middle text-muted" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem href="">Download</DropdownItem>
            <DropdownItem href="">Export</DropdownItem>
            <DropdownItem href="">Import</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
      <CardBody className="py-2 px-0">
        <SimplebarReactClient className="px-2" style={{ height: 270 }}>
          {list.map((item, idx) => (
            <div className="d-flex justify-content-between align-items-center p-2" key={idx}>
              <span className="align-middle fw-medium">{isApiData ? item.browser : item.name}</span>
              <span className="fw-semibold text-muted">
                {isApiData ? `${Math.round((item.sessions / max) * 100)}%` : `${item.percentage}%`}
              </span>
              <span className="fw-semibold text-muted">
                {isApiData ? item.sessions.toLocaleString() : `${item.amount}k`}
              </span>
            </div>
          ))}
        </SimplebarReactClient>
      </CardBody>
    </Card>
  );
};

export default SessionByBrowser;
