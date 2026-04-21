import { Link } from 'react-router-dom';

const LogoBox = ({ containerClassName, squareLogo, textLogo }) => {
  return (
    <div className={containerClassName ?? ''}>
      <Link
        to="/"
        className="logo-dark text-decoration-none"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          gap: 8,
          marginTop: 12,
        }}
      >
        <img
          src="/logo1.png"
          alt="Logo"
          className={squareLogo?.className}
          style={{
            width: 'auto',
            height: 56,
            maxWidth: '100%',
            objectFit: 'contain',
            flexShrink: 0,
          }}
        />
      </Link>
    </div>
  );
};
export default LogoBox;