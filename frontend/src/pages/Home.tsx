export const Home = () => {
  return (
    <div className="text-center py-10">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-6 drop-shadow-sm">
          Find Your Perfect Ride
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          Experience the freedom of the road with our premium fleet. Whether it's a daily commute or a weekend getaway, we have the perfect car for you.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto text-blue-600 text-2xl">🏆</div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900">Luxury Cars</h3>
          <p className="text-gray-500">Experience ultimate comfort and style with our top-of-the-line luxury collection.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
          <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto text-indigo-600 text-2xl">🚙</div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900">SUVs</h3>
          <p className="text-gray-500">Spacious, powerful, and ready for any terrain. Perfect for family trips.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
           <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto text-green-600 text-2xl">⚡</div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900">Economy</h3>
          <p className="text-gray-500">Efficient, reliable, and affordable options for your everyday needs.</p>
        </div>
      </div>
    </div>
  );
};
