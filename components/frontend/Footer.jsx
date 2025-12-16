import Link from "next/link";

const Footer = () => {
  return (
    <section className="py-10 bg-gray-50 sm:pt-16 lg:pt-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">

          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
            <img
              className="w-auto h-9"
              src="/limiLogo.webp.png"
              alt="Buylog Logo"
            />

            <p className="text-base leading-relaxed text-gray-600 mt-7">
              Buylog is a trusted online marketplace designed to connect buyers
              and sellers seamlessly. We provide a secure and user-friendly
              platform where sellers can showcase their products and buyers can
              easily find, compare, and purchase what they need.
            </p>

            <ul className="flex items-center space-x-3 mt-9">
              <li><a href="#" className="social-icon" /></li>
              <li><a href="#" className="social-icon" /></li>
              <li><a href="#" className="social-icon" /></li>
              <li><a href="#" className="social-icon" /></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
              Company
            </p>

            <ul className="mt-6 space-y-4">
              <li><a href="#" className="footer-link">About</a></li>
              <li><a href="#" className="footer-link">Features</a></li>
              <li><a href="#" className="footer-link">Works</a></li>
              <li><a href="#" className="footer-link">Career</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
              Help
            </p>

            <ul className="mt-6 space-y-4">
              <li><a href="#" className="footer-link">Customer Support</a></li>
              <li><a href="#" className="footer-link">Delivery Details</a></li>

              {/* ✅ Correct Terms link */}
              <li>
                <Link
                  href="/front-end/terms"
                  className="footer-link"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li><a href="#" className="footer-link">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
              Subscribe to newsletter
            </p>

            <form className="mt-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="block w-full p-4 text-black placeholder-gray-500 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600"
              />

              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-4 mt-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="mt-16 mb-10 border-gray-200" />

        <p className="text-sm text-center text-gray-600">
          © {new Date().getFullYear()} Buylog. All Rights Reserved.
        </p>
      </div>
    </section>
  );
};

export default Footer;
