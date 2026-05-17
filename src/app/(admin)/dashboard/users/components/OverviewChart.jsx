import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';
import DateRangeFilter from '@/components/common/DateRangeFilter';

const EMPTY_12 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const DEFAULT_CATS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const OverviewChart = ({ series, categories }) => {
  const handleDateRangeChange = (range, startDate, endDate) => {
    console.log('Date range changed:', { range, startDate, endDate });
  };

  const chartSeries = series ?? [
    { name: 'Free Users', type: 'area', data: EMPTY_12 },
    { name: 'Paid Users', type: 'line', data: EMPTY_12 },
  ];
  const chartCategories = categories ?? DEFAULT_CATS;

  const chartOptions = {
    chart: { height: 369, type: 'line', toolbar: { show: false } },
    stroke: { dashArray: [0, 8], width: [2, 2], curve: 'smooth' },
    fill: {
      opacity: [1, 1, 0.3],
      type: ['gradient', 'solid', 'gradient'],
      gradient: { type: 'vertical', inverseColors: false, opacityFrom: 0.5, opacityTo: 0, stops: [0, 70] },
    },
    markers: { size: [0, 0, 0], strokeWidth: 2, hover: { size: 4 } },
    xaxis: { categories: chartCategories, axisTicks: { show: false }, axisBorder: { show: false } },
    yaxis: {
      min: 0,
      labels: { formatter: (val) => val.toFixed(0) },
      axisBorder: { show: false },
    },
    grid: {
      show: true,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: -2, bottom: 15, left: 15 },
    },
    legend: {
      show: true,
      horizontalAlign: 'center',
      offsetX: 0,
      offsetY: 5,
      markers: { width: 9, height: 9, radius: 6 },
      itemMargin: { horizontal: 10, vertical: 0 },
    },
    plotOptions: { bar: { columnWidth: '30%', barHeight: '70%', borderRadius: 3 } },
    colors: ['#7f56da', '#22c55e', '#3b82f6'],
    tooltip: { shared: true },
  };

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <CardTitle>Overview</CardTitle>
        <DateRangeFilter onDateRangeChange={handleDateRangeChange} selectedRange="Last 12 months" />
      </CardHeader>
      <CardBody>
        <div dir="ltr">
          <ReactApexChart height={369} options={chartOptions} series={chartSeries} type="line" className="apex-charts" />
        </div>
      </CardBody>
    </Card>
  );
};

export default OverviewChart;
