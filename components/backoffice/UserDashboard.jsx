// app/components/backoffice/UserDashboard.jsx
export default function UserDashboard({ orders }) {
  return (
    <div className="p-6">
      <h2>Welcome User</h2>
      <div>Orders: {orders.length}</div>
    </div>
  );
}
