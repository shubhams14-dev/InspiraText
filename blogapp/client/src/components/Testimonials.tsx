const Testimonials = () => {
    return (
      <section id="testimonies" className="pt-20">
        <div className="max-w-6xl mx-8 md:mx-10 lg:mx-20 xl:mx-auto">
          <div className="transition duration-500 ease-in-out transform">
            <div className="mb-12 space-y-2 md:mb-16 md:text-center">
              <div className="inline-block px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-full">
                Words from Others
              </div>
              <h1 className="mb-5 text-3xl font-semibold text-gray-800">
                It's not just us.
              </h1>
              <p className="text-xl text-gray-700 md:text-center">
                Here's what others have to say about us.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* First Column */}
            <ul className="space-y-8">
              {/* Testimonial 1 */}
              <li className="text-sm leading-6">
                <div className="relative group">
                  <a href="https://twitter.com/kanyewest" className="cursor-pointer">
                    <div className="relative p-6 space-y-6 leading-normal text-gray-700 bg-gray-50 border rounded-lg shadow-sm">
                      <div className="flex items-center space-x-4">
                        <img
                          src="https://pbs.twimg.com/profile_images/123456789/kanye.jpg"
                          className="w-12 h-12 rounded-full bg-center bg-cover"
                          alt="Kanye West"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Kanye West</h3>
                          <p className="text-gray-500 text-md">Rapper & Entrepreneur</p>
                        </div>
                      </div>
                      <p>Find God.</p>
                    </div>
                  </a>
                </div>
              </li>
              {/* Testimonial 2 */}
              <li className="text-sm leading-6">
                <div className="relative group">
                  <a href="https://twitter.com/tim_cook" className="cursor-pointer">
                    <div className="relative p-6 space-y-6 leading-normal text-gray-700 bg-gray-50 border rounded-lg shadow-sm">
                      <div className="flex items-center space-x-4">
                        <img
                          src="https://pbs.twimg.com/profile_images/123456789/tim.jpg"
                          className="w-12 h-12 rounded-full bg-center bg-cover"
                          alt="Tim Cook"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Tim Cook</h3>
                          <p className="text-gray-500 text-md">CEO of Apple</p>
                        </div>
                      </div>
                      <p>
                        Diam quis enim lobortis scelerisque fermentum dui faucibus in ornare. Donec pretium
                        vulputate sapien nec sagittis aliquam malesuada bibendum.
                      </p>
                    </div>
                  </a>
                </div>
              </li>
            </ul>
            {/* Second Column */}
            <ul className="space-y-8 sm:block">
              {/* Testimonial 3 */}
              <li className="text-sm leading-6">
                <div className="relative group">
                  <a href="https://twitter.com/paraga" className="cursor-pointer">
                    <div className="relative p-6 space-y-6 leading-normal text-gray-700 bg-gray-50 border rounded-lg shadow-sm">
                      <div className="flex items-center space-x-4">
                        <img
                          src="https://pbs.twimg.com/profile_images/123456789/paraga.jpg"
                          className="w-12 h-12 rounded-full bg-center bg-cover"
                          alt="Parag Agrawal"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Parag Agrawal</h3>
                          <p className="text-gray-500 text-md">CEO of Twitter</p>
                        </div>
                      </div>
                      <p>
                        Enim neque volutpat ac tincidunt vitae semper. Turpis cursus in hac habitasse platea
                        dictumst.
                      </p>
                    </div>
                  </a>
                </div>
              </li>
            </ul>
            {/* Third Column */}
            <ul className="hidden space-y-8 lg:block">
              {/* Testimonial 4 */}
              <li className="text-sm leading-6">
                <div className="relative group">
                  <a href="https://twitter.com/satyanadella" className="cursor-pointer">
                    <div className="relative p-6 space-y-6 leading-normal text-gray-700 bg-gray-50 border rounded-lg shadow-sm">
                      <div className="flex items-center space-x-4">
                        <img
                          src="https://pbs.twimg.com/profile_images/123456789/satya.jpg"
                          className="w-12 h-12 rounded-full bg-center bg-cover"
                          alt="Satya Nadella"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Satya Nadella</h3>
                          <p className="text-gray-500 text-md">CEO of Microsoft</p>
                        </div>
                      </div>
                      <p>
                        Tortor dignissim convallis aenean et tortor at risus. Faucibus ornare suspendisse sed
                        nisi lacus sed viverra tellus.
                      </p>
                    </div>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
  };
  
  export default Testimonials;
  