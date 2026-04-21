import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardHeader, CardTitle, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table } from 'react-bootstrap';
const SalesByCategory = () => {
  const chartOptions = {
    chart: {
      height: 250,
      type: 'donut'
    },
    legend: {
      show: false,
      position: 'bottom',
      horizontalAlign: 'center',
      offsetX: 0,
      offsetY: -5,
      markers: {
        width: 9,
        height: 9,
        radius: 6
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0
      }
    },
    stroke: {
      width: 0
    },
    plotOptions: {
      pie: {
        donut: {
          size: '80%',
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
              label: 'All Users'
            }
          }
        }
      }
    },
    series: [0, 0],
    labels: ['Paying', 'Free'],
    colors: ['#f9b931', '#ff86c8', '#4ecac2', '#7f56da'],
    dataLabels: {
      enabled: false
    }
  };
  return <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <CardTitle>Traffic Source</CardTitle>
        <Dropdown>
          <DropdownToggle as={'a'} role="button" className="arrow-none card-drop">
            <IconifyIcon icon="iconamoon:menu-kebab-vertical-circle-duotone" className="fs-20 align-middle text-muted" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem href="">Sales Report</DropdownItem>
            <DropdownItem href="">Export Report</DropdownItem>
            <DropdownItem href="">Profit</DropdownItem>
            <DropdownItem href="">Action</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
      <CardBody>
        <div dir="ltr">
          <ReactApexChart height={250} options={chartOptions} series={chartOptions.series} type="donut" className="apex-charts" />
        </div>
        <div className="table-responsive mb-n1 mt-2">
          <Table borderless size="sm" className="table-nowrap table-centered mb-0">
            <thead className="bg-light bg-opacity-50 thead-sm">
              <tr>
                <th className="py-1">Mockups</th>
                <th className="py-1"></th>
                <th className="py-1"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>T-shirt</td>
                <td>0</td>
                <td>
                  0%&nbsp;
                  <span className="badge badge-soft-secondary ms-1">0%</span>
                </td>
              </tr>
              <tr>
                <td>Hoodie</td>
                <td>0</td>
                <td>
                  0%&nbsp;
                  <span className="badge badge-soft-secondary ms-1">0%</span>
                </td>
              </tr>
              <tr>
                <td>Other</td>
                <td>0</td>
                <td>
                  0%&nbsp;
                  <span className="badge badge-soft-secondary ms-1">0%</span>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>;
};
export default SalesByCategory;