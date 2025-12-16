import Link from "next/link";

const Footer = () => {
  return (
    <section className="py-10 bg-gray-50 sm:pt-16 lg:pt-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-2 gap-x-12 gap-y-16 md:grid-cols-3 lg:grid-cols-6">
          
          {/* BRAND SECTION */}
          <div className="col-span-2 lg:col-span-2 lg:pr-8">
            <img
              className="w-auto h-9"
              src="/limiLogo.webp.png"
              alt="Buylog Logo"
            />

            <p className="mt-7 text-base leading-relaxed text-gray-600">
              Buylog is a trusted online marketplace designed to connect buyers
              and sellers seamlessly. We provide a secure and user-friendly
              platform where sellers can showcase their products and buyers can
              easily find, compare, and purchase what they need.
            </p>

            {/* SOCIALS */}
            <ul className="flex items-center mt-9 space-x-3">
              {["twitter", "facebook", "instagram", "github"].map(
                (platform, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex items-center justify-center w-7 h-7 text-white bg-gray-800 rounded-full hover:bg-blue-600 transition"
                    >
                      <span className="sr-only">{platform}</span>
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
              Company
            </p>

            <ul className="mt-6 space-y-4">
              <li><a href="#" className="footer-link">About</a></li>
              <li><a href="#" className="footer-link">Features</a></li>
              <li><a href="#" className="footer-link">How it Works</a></li>
              <li><a href="#" className="footer-link">Careers</a></li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
              Help
            </p>

            <ul className="mt-6 space-y-4">
              <li>
                <a href="#" className="footer-link">
                  Customer Support
                </a>
              </li>

              <li>
                <a href="#" className="footer-link">
                  Delivery Details
                </a>
              </li>

              {/* ✅ TERMS PAGE */}
              <li>
                <Link href="/terms" className="footer-link">
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <a href="#" className="footer-link">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="col-span-2 lg:col-span-2 lg:pl-8">
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
              Subscribe to newsletter
            </p>

            <form className="mt-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="block w-full p-4 text-black placeholder-gray-500 border border-gray-200 rounded-md focus:outline-none focus:border-blue-600"
              />

              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-4 mt-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="mt-16 mb-10 border-gray-200" />

        <p className="text-sm text-center text-gray-600">
          © {new Date().getFullYear()} Buylog. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default Footer;
