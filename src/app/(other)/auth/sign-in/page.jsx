import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LogoBox from '@/components/LogoBox';
import PageMetaData from '@/components/PageTitle';
import LoginForm from './LoginForm';
const SignIn = () => {
  return <>
      <PageMetaData title="Sign In" />

      <Card className="auth-card">
        <CardBody className="p-0">
          <Row className="align-items-center g-0">
            <Col lg={6} className="d-none d-lg-inline-block border-end">
              <div className="auth-page-sidebar">
                <div
                  style={{
                    height: '100%',
                    minHeight: 521,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 24,
                  }}
                >
                  <img
                    src="/logo.png"
                    alt="Logo"
                    style={{ width: 'min(420px, 80%)', height: 'auto', objectFit: 'contain' }}
                  />
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="p-4">
                <div className="mx-auto mb-4 text-center auth-logo">
                  <LogoBox textLogo={{
                  height: 24,
                  width: 73
                }} squareLogo={{
                  className: 'me-1'
                }} containerClassName="mx-auto mb-4 text-center auth-logo" />
                </div>
                <h2 className="fw-bold text-center fs-18">Sign In</h2>
                <p className="text-muted text-center mt-1 mb-4">Enter your email address and password to access admin panel.</p>
                <Row className="justify-content-center">
                  <Col xs={12} md={8}>
                    <LoginForm />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>;
};
export default SignIn;