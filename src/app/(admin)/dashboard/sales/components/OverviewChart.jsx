import ReactApexChart from 'react-apexcharts';
import { Button, Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';
import DateRangeFilter from '@/components/common/DateRangeFilter';
const OverviewChart = () => {
  const handleDateRangeChange = (range, startDate, endDate) => {
    console.log('Date range changed:', { range, startDate, endDate });
    // Here you can update the chart data based on the selected date range
    // You might want to fetch new data from an API or filter existing data
  };
  const chartOptions = {
    series: [{
      name: 'Revenue',
      type: 'area',
      data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67]
    }, {
      name: 'Orders',
      type: 'line',
      data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35]
    },{
      name: 'Revenue3',
      type: 'area',
      data: [30, 45, 40, 55, 60, 65, 70, 85, 78, 82, 88, 95]
    }],
    chart: {
      height: 369,
      type: 'line',
      toolbar: {
        show: false
      }
    },
    stroke: {
      dashArray: [0, 8],
      width: [2, 2],
      curve: 'smooth'
    },
    fill: {
      opacity: [1, 1, 0.3],
      type: ['gradient', 'solid', 'gradient'],
      gradient: {
        type: 'vertical',
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 70]
      }
    },
    markers: {
      size: [0, 0, 0],
      strokeWidth: 2,
      hover: {
        size: 4
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      }
    },
    yaxis: {
      min: 0,
      labels: {
        formatter: function (val) {
          return val.toFixed(0) + 'k';
        }
      },
      axisBorder: {
        show: false
      }
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 15,
        left: 15
      }
    },
    legend: {
      show: true,
      horizontalAlign: 'center',
      offsetX: 0,
      offsetY: 5,
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
    plotOptions: {
      bar: {
        columnWidth: '30%',
        barHeight: '70%',
        borderRadius: 3
      }
    },
    colors: ['#7f56da', '#22c55e', '#3b82f6'],
    tooltip: {
      shared: true,
      y: [{
        formatter: function (y) {
          if (typeof y !== 'undefined') {
            return '$' + y.toFixed(2) + 'k';
          }
          return y;
        }
      }, {
        formatter: function (y) {
          if (typeof y !== 'undefined') {
            return '$' + y.toFixed(2) + 'k';
          }
          return y;
        }
      }]
    }
  };
  return <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <CardTitle>Overview</CardTitle>
        <DateRangeFilter 
          onDateRangeChange={handleDateRangeChange}
          selectedRange="Last 30 days"
        />
      </CardHeader>
      <CardBody>
        <div dir="ltr">
          <ReactApexChart height={369} options={chartOptions} series={chartOptions.series} type="line" className="apex-charts" />
        </div>
      </CardBody>
    </Card>;
};
export default OverviewChart;