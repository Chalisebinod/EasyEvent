import { motion } from 'framer-motion';
import Navbar from './Navbar';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
    {/* Navbar */}
    <Navbar />
    <div className="bg-gray-100 py-12 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* Our Mission Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-orange-600">Our Mission</h2>
          <p className="text-gray-700 mt-4 text-lg max-w-2xl mx-auto">
            Simplifying event planning by connecting people with the perfect venues and services.
            We aim to make the process secure, efficient, and enjoyable for everyone.
          </p>
        </motion.div>

        {/* Our Story Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white shadow-lg rounded-xl p-8"
        >
          <h3 className="text-2xl font-semibold text-orange-600">Our Story</h3>
          <p className="text-gray-700 mt-4">
            Our journey began with the realization that event planning is often stressful and inefficient.
            We created the Event-Venue Booking System to change that. By leveraging technology, we provide a
            seamless platform where users can search, book, and manage venues with ease.
          </p>
        </motion.div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* What We Offer */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <h4 className="text-xl font-semibold text-orange-600">What We Offer</h4>
            <ul className="text-gray-700 mt-4 space-y-2">
              <li>✔ Verified Venue Details</li>
              <li>✔ Secure Transactions</li>
              <li>✔ Real-Time Messaging</li>
              <li>✔ Customized Solutions</li>
            </ul>
          </motion.div>

          {/* By the Numbers */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <h4 className="text-xl font-semibold text-orange-600">By the Numbers</h4>
            <ul className="text-gray-700 mt-4 space-y-2">
              <li>📌 1000+ Venues Listed</li>
              <li>📌 500+ Events Booked Monthly</li>
              <li>📌 95% Customer Satisfaction</li>
            </ul>
          </motion.div>

          {/* Contact Us */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <h4 className="text-xl font-semibold text-orange-600">Contact Us</h4>
            <p className="text-gray-700 mt-4">
              Have questions or need assistance?
            </p>
            <p className="text-gray-700 mt-2">📧 Email: chalisebinod40@gmail.com</p>
            <p className="text-gray-700">📞 Phone: +977-9863335795</p>
            <p className="text-gray-700">📍 Address: Kathmandu, Nepal</p>
          </motion.div>
        </div>
      </div>
    </div>
    </div>
  );
}
