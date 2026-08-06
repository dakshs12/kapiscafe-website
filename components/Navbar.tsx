import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 md:p-6 lg:px-12 bg-secondary-white text-secondary-brown border-b border-primary-mustard/20">
      <div className="flex items-center">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image 
            src="/kapis-logo.svg" 
            alt="Kapi's Bakehouse" 
            width={160} 
            height={60} 
            className="w-24 sm:w-32 md:w-40 h-auto object-contain"
          />
        </Link>
      </div>
      <div className="flex gap-4 sm:gap-6 md:gap-8 font-medium text-sm md:text-base">
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
