import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h2 className="text-danger">Access Denied</h2>
      <p>You do not have permission to access this page.</p>
      <Link to="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  );
};

export default Unauthorized;
