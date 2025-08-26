import SafeForm from "./components/SafeForm";
import "./App.css";

export default function App() {
  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="text-3xl font-bold">Secure Registration</h1>
          <p className="mt-2 opacity-90">Validasi + Aman</p>
        </div>
        <div className="card-body">
          <SafeForm />
        </div>
      </div>
    </div>
  );
}
