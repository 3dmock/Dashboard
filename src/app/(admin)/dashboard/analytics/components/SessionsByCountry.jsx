import { Fragment } from 'react';
import {
  Card, CardBody, CardHeader, CardTitle, Col,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle, ProgressBar, Row,
} from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { WorldVectorMap } from '@/components/VectorMap';
import { countries as staticCountries } from '../data';

// GA4 full country name → ISO-3166-1 alpha-2
const COUNTRY_ISO = {
  Afghanistan: 'AF', Albania: 'AL', Algeria: 'DZ', Angola: 'AO',
  Argentina: 'AR', Armenia: 'AM', Australia: 'AU', Austria: 'AT',
  Azerbaijan: 'AZ', Bahrain: 'BH', Bangladesh: 'BD', Belarus: 'BY',
  Belgium: 'BE', Bolivia: 'BO', Brazil: 'BR', Bulgaria: 'BG',
  Cambodia: 'KH', Cameroon: 'CM', Canada: 'CA', Chile: 'CL',
  China: 'CN', Colombia: 'CO', Croatia: 'HR', Cuba: 'CU',
  'Czech Republic': 'CZ', Czechia: 'CZ', Denmark: 'DK',
  'Dominican Republic': 'DO', Ecuador: 'EC', Egypt: 'EG',
  Estonia: 'EE', Ethiopia: 'ET', Finland: 'FI', France: 'FR',
  Georgia: 'GE', Germany: 'DE', Ghana: 'GH', Greece: 'GR',
  Guatemala: 'GT', Honduras: 'HN', 'Hong Kong': 'HK', Hungary: 'HU',
  India: 'IN', Indonesia: 'ID', Iran: 'IR', Iraq: 'IQ',
  Ireland: 'IE', Israel: 'IL', Italy: 'IT', Japan: 'JP',
  Jordan: 'JO', Kazakhstan: 'KZ', Kenya: 'KE', Kuwait: 'KW',
  Latvia: 'LV', Lebanon: 'LB', Libya: 'LY', Lithuania: 'LT',
  Malaysia: 'MY', Mexico: 'MX', Moldova: 'MD', Morocco: 'MA',
  Mozambique: 'MZ', Myanmar: 'MM', Nepal: 'NP', Netherlands: 'NL',
  'New Zealand': 'NZ', Nigeria: 'NG', Norway: 'NO', Oman: 'OM',
  Pakistan: 'PK', Panama: 'PA', Peru: 'PE', Philippines: 'PH',
  Poland: 'PL', Portugal: 'PT', Qatar: 'QA', Romania: 'RO',
  Russia: 'RU', Rwanda: 'RW', 'Saudi Arabia': 'SA', Senegal: 'SN',
  Serbia: 'RS', Singapore: 'SG', Slovakia: 'SK', Slovenia: 'SI',
  Somalia: 'SO', 'South Africa': 'ZA', 'South Korea': 'KR',
  Spain: 'ES', 'Sri Lanka': 'LK', Sudan: 'SD', Sweden: 'SE',
  Switzerland: 'CH', Syria: 'SY', Taiwan: 'TW', Tanzania: 'TZ',
  Thailand: 'TH', Tunisia: 'TN', Turkey: 'TR', Uganda: 'UG',
  Ukraine: 'UA', 'United Arab Emirates': 'AE', 'United Kingdom': 'GB',
  'United States': 'US', Uruguay: 'UY', Uzbekistan: 'UZ',
  Venezuela: 'VE', Vietnam: 'VN', Yemen: 'YE', Zimbabwe: 'ZW',
};

const VARIANTS = ['primary', 'success', 'info', 'warning', 'danger'];

const SessionsByCountry = ({ countriesData }) => {
  const isApiData = !!countriesData;
  const list = countriesData ?? staticCountries;
  const max = isApiData ? list[0]?.sessions || 1 : 1;

  // Build { 'US': 30, 'MA': 169 } for jsvectormap series
  const regionValues = {};
  if (isApiData) {
    for (const item of list) {
      const code = COUNTRY_ISO[item.country];
      if (code) regionValues[code] = item.sessions;
    }
  }

  const hasRegions = Object.keys(regionValues).length > 0;

  const mapOptions = {
    zoomOnScroll: false,
    zoomButtons: false,
    backgroundColor: 'transparent',
    regionStyle: {
      initial: { fill: '#eeecf8', fillOpacity: 1, stroke: '#e2dff0', strokeWidth: 0.3 },
      hover: { fillOpacity: 0.75 },
    },
    ...(hasRegions && {
      series: {
        regions: [{
          attribute: 'fill',
          scale: ['#ddc8f0', '#7c35b0'],
          values: regionValues,
          normalizeFunction: 'polynomial',
        }],
      },
      onRegionTooltipShow: (e, tooltip, code) => {
        const sessions = regionValues[code];
        if (sessions != null) {
          tooltip.text(`${tooltip.text()}: ${sessions.toLocaleString()} sessions`);
        }
      },
    }),
  };

  // Force remount when real data arrives so BaseVectorMap recreates with series
  const mapKey = hasRegions
    ? `live-${Object.keys(regionValues).sort().join(',')}`
    : 'empty';

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
      <CardBody>
        {/* World map — remounts when live data arrives to apply region colors */}
        <div className="mb-2">
          <WorldVectorMap key={mapKey} height="260px" width="100%" options={mapOptions} />
        </div>

        {/* Horizontal bar list below the map */}
        {list.length > 0 && (
          <div className="pt-3 border-top">
            {list.map((item, idx) => (
              <Fragment key={idx}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fs-13 align-middle">
                    {!isApiData && (
                      <IconifyIcon icon={item.icon} className="fs-16 align-middle me-1" />
                    )}
                    {isApiData ? item.country : item.name}
                  </span>
                  <span className="fs-13 fw-semibold text-muted">
                    {isApiData ? item.sessions.toLocaleString() : `${item.amount}k`}
                  </span>
                </div>
                <Row className={`align-items-center ${idx < list.length - 1 ? 'mb-3' : ''}`}>
                  <Col>
                    <ProgressBar
                      variant={isApiData ? VARIANTS[idx % 5] : item.variant}
                      now={isApiData ? Math.round((item.sessions / max) * 100) : item.value}
                      className="progress progress-soft progress-sm"
                    />
                  </Col>
                </Row>
              </Fragment>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default SessionsByCountry;
