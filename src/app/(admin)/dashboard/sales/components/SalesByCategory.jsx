import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';

const MODEL_COLORS = [
  '#7c6af7', '#f472b6', '#22c55e', '#f59e0b',
  '#3b82f6', '#ec4899', '#10b981', '#f97316',
];

const SalesByCategory = ({ modelUsage }) => {
  const list = Array.isArray(modelUsage) ? modelUsage : [];
  const total = list.reduce((sum, m) => sum + m.views, 0) || 1;
  const max = list[0]?.views || 1;

  return (
    <Card className="h-100">
      <CardHeader className="border-bottom border-dashed">
        <CardTitle className="mb-0">Models Usage</CardTitle>
      </CardHeader>
      <CardBody>
        {list.length === 0 ? (
          <div className="d-flex align-items-center justify-content-center h-100" style={{ minHeight: 200 }}>
            <p className="text-muted mb-0">No model usage data yet</p>
          </div>
        ) : (
          list.map((item, idx) => {
            const pct = ((item.views / total) * 100).toFixed(1);
            const color = MODEL_COLORS[idx % MODEL_COLORS.length];
            return (
              <div key={idx} className={idx < list.length - 1 ? 'mb-3' : ''}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-medium fs-13" style={{ color }}>
                    {item.model}
                  </span>
                  <span className="text-muted fs-13">
                    {item.views.toLocaleString()}&nbsp;
                    <span className="badge badge-soft-secondary">{pct}%</span>
                  </span>
                </div>
                <div className="progress progress-sm" style={{ height: 6 }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${Math.round((item.views / max) * 100)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardBody>
    </Card>
  );
};

export default SalesByCategory;
