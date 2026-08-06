import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full p-4 md:p-6 text-center text-xs sm:text-sm font-medium border-t border-primary-mustard/20 mt-auto">
      <div className="flex flex-col items-center justify-center gap-4">
        <Image 
          src="/kapis-logo.svg" 
          alt="Kapi's Bakehouse" 
          width={80} 
          height={30} 
          className="w-16 sm:w-20 h-auto object-contain opacity-80 grayscale hover:grayscale-0 transition-all duration-300" 
        />
        <p>&copy; {new Date().getFullYear()} Kapi's Bakehouse. All rights reserved.</p>
      </div>
    </footer>
  );
}
