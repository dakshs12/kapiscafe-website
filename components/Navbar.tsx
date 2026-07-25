import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-6 bg-secondary-white text-secondary-brown border-b border-primary-mustard/20">
      <div className="flex items-center">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image 
            src="/kapis-logo.svg" 
            alt="Kapi's Bakehouse" 
            width={160} 
            height={60} 
            className="w-32 sm:w-40 h-auto object-contain"
          />
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
