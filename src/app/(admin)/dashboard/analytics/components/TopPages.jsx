import { Button, Card, CardHeader, CardTitle, Table } from 'react-bootstrap';
import { pagesList } from '../data';

const bounceVariant = (rate) => {
  const n = parseFloat(rate);
  if (n < 30) return 'success';
  if (n < 50) return 'warning';
  return 'danger';
};

const TopPages = ({ pagesData }) => {
  const isApiData = !!pagesData;
  const list = pagesData ?? pagesList;

  return (
    <Card>
      <CardHeader className="d-flex align-items-center justify-content-between gap-2">
        <CardTitle className="flex-grow-1">Top Pages</CardTitle>
        <div>
          <Button variant="soft-primary" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <div className="table-responsive">
        <Table hover className="table-nowrap table-centered m-0">
          <thead className="bg-light bg-opacity-50">
            <tr>
              <th className="text-muted py-1">Page Path</th>
              <th className="text-muted py-1">Page Views</th>
              <th className="text-muted py-1">Avg Time on Page</th>
              <th className="text-muted py-1">Bounce Rate</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted py-4">No data</td>
              </tr>
            ) : (
              list.map((page, idx) => (
                <tr key={idx}>
                  <td>
                    <span className="text-muted">{isApiData ? page.pagePath : page.path}</span>
                  </td>
                  <td>{isApiData ? page.pageViews.toLocaleString() : page.views}</td>
                  <td>{isApiData ? page.avgTime : page.time}</td>
                  <td>
                    <span className={`badge badge-soft-${isApiData ? bounceVariant(page.bounceRate) : page.variant}`}>
                      {isApiData ? `${page.bounceRate}%` : `${page.rate}%`}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default TopPages;
