
import { Link } from 'react-router-dom';

export const EmptyBookings = () => (
  <div className="p-10 text-center text-gray-500">
    <p>You haven't made any bookings yet.</p>
    <Link to="/vehicles" className="text-blue-600 hover:text-blue-500 mt-2 inline-block">Browse Vehicles</Link>
  </div>
);
