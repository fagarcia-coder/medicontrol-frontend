import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">© {new Date().getFullYear()} Medicontrol</div>
        <div className="flex items-center gap-4">
          <Link to="/informacion" className="text-sm text-sky-700 hover:underline">Información</Link>
          <a className="text-sm text-gray-500" href="#">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
