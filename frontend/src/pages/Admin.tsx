import AdminPanel from '../components/AdminPanel';
import Header from '../components/Header';

export default function Admin() {
  return (
    <>
      <Header isAdmin={true} />
      <AdminPanel />
    </>
  );
}
