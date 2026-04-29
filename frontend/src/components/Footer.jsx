function Footer() {
  return (
    <footer className="border-t-2 border-black px-8 py-5 flex justify-between items-center
                       text-[0.65rem] tracking-[0.16em] uppercase text-gray-400"
             style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <span>Products &copy; {new Date().getFullYear()}</span>
      <span>All rights reserved</span>
    </footer>
  );
}

export default Footer;
