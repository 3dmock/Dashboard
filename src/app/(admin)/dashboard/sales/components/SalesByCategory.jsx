import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardHeader, CardTitle, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table } from 'react-bootstrap';

const SalesByCategory = ({ donutSeries, donutLabels }) => {
  const series = donutSeries ?? [0, 0];
  const labels = donutLabels ?? ['Paying', 'Free'];

  const chartOptions = {
    chart: { height: 250, type: 'donut' },
    legend: {
      show: false,
      position: 'bottom',
      horizontalAlign: 'center',
      offsetX: 0,
      offsetY: -5,
      markers: { width: 9, height: 9, radius: 6 },
      itemMargin: { horizontal: 10, vertical: 0 },
    },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: '80%',
          labels: {
            show: true,
            total: { showAlways: true, show: true, label: 'All Users' },
          },
        },
      },
    },
    labels,
    colors: ['#f9b931', '#ff86c8', '#4ecac2', '#7f56da'],
    dataLabels: { enabled: false },
  };

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <CardTitle>Sales By Category</CardTitle>
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
          <ReactApexChart height={250} options={chartOptions} series={series} type="donut" className="apex-charts" />
        </div>
        <div className="table-responsive mb-n1 mt-2">
          <Table borderless size="sm" className="table-nowrap table-centered mb-0">
            <thead className="bg-light bg-opacity-50 thead-sm">
              <tr>
                <th className="py-1">Plan</th>
                <th className="py-1">Users</th>
                <th className="py-1">Share</th>
              </tr>
            </thead>
            <tbody>
              {labels.map((label, i) => {
                const total = series.reduce((a, b) => a + b, 0) || 1;
                const pct = Math.round((series[i] / total) * 100);
                return (
                  <tr key={i}>
                    <td>{label}</td>
                    <td>{(series[i] || 0).toLocaleString()}</td>
                    <td>
                      {pct}%&nbsp;
                      <span className="badge badge-soft-secondary ms-1">{pct}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

export default SalesByCategory;
