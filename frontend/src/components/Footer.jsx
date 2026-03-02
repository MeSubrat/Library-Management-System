
const Footer = () => {
  return (
    <footer className="bg-dark-card border-t border-gray-800 mt-auto">
      <div className="container mx-auto py-4 px-5 text-center">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} BiblioVibe. All Rights Reserved.
        </p>
         <p className="text-gray-500 text-xs mt-1">
          A Gen Z library for the modern reader.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
