import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-6 bg-secondary-white text-secondary-brown border-b border-primary-mustard/20">
      <div className="text-xl font-bold">
        {/* Placeholder for Kapi's Bakehouse logo */}
        <Link href="/">
          <span className="text-primary-teal">Kapi's</span> Bakehouse
        </Link>
      </div>
      <div className="flex gap-8 font-medium">
        <Link href="/" className="hover:text-primary-teal transition-colors">
          Home
        </Link>
        <Link href="/menu" className="hover:text-primary-teal transition-colors">
          Menu
        </Link>
        <Link href="/custom-cakes" className="hover:text-primary-teal transition-colors">
          Custom Cakes
        </Link>
        <Link href="/location" className="hover:text-primary-teal transition-colors">
          Location
        </Link>
      </div>
    </nav>
  );
}
