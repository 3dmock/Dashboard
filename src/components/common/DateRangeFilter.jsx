import React, { useState } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const DateRangeFilter = ({ onDateRangeChange, selectedRange = 'Last 30 days' }) => {
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState('2025-09-12');
  const [endDate, setEndDate] = useState('2025-10-11');
  const [currentRange, setCurrentRange] = useState(selectedRange);

  const predefinedRanges = [
    'Last 7 days',
    'Last 30 days',
    'Last 90 days',
    'This month',
    'Last month',
    'This year',
    'Custom'
  ];

  const handleRangeSelect = (range) => {
    if (range !== 'Custom') {
      setCurrentRange(range);
      onDateRangeChange && onDateRangeChange(range, startDate, endDate);
      setShow(false);
    } else {
      setCurrentRange(range);
    }
  };

  const handleApplyCustom = () => {
    setCurrentRange(`${startDate} to ${endDate}`);
    onDateRangeChange && onDateRangeChange('Custom', startDate, endDate);
    setShow(false);
  };

  const handleCancel = () => {
    setShow(false);
  };

  return (
    <Dropdown show={show} onToggle={setShow}>
      <Dropdown.Toggle 
        as={Button} 
        variant="outline-secondary" 
        size="sm"
        className="d-flex align-items-center gap-2"
      >
        <IconifyIcon icon="bx:calendar" className="fs-16" />
        {currentRange}
        <IconifyIcon icon="bx:chevron-down" className="fs-12" />
      </Dropdown.Toggle>

      <Dropdown.Menu className="p-3" style={{ minWidth: '350px' }}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Date range</label>
          <Form.Select 
            size="sm" 
            value={currentRange} 
            onChange={(e) => handleRangeSelect(e.target.value)}
          >
            {predefinedRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </Form.Select>
        </div>

        {currentRange === 'Custom' && (
          <>
            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label">Starting</label>
                <Form.Control
                  type="date"
                  size="sm"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label className="form-label">Ending</label>
                <Form.Control
                  type="date"
                  size="sm"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <Button variant="light" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleApplyCustom}
                disabled={!startDate || !endDate}
              >
                Apply
              </Button>
            </div>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DateRangeFilter;
