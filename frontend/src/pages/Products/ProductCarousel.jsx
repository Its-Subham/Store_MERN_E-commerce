import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4 ">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings} className="w-full max-w-[90vw] md:max-w-[56rem] lg:max-w-[30rem] ">
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div
                key={_id}
                className="p-4 bg-white shadow-md h-[35rem] flex flex-col justify-between "
              >
                {/* Image Section */}
                <div className="w-full h-[15rem] ">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="mt-5 flex-1 text-center">
                  <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {name}
                  </h2>
                  <p className="text-lg font-bold text-pink-600">
                    ₹ {price.toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3 mt-2">
                    {description?.length > 205 ? description.substring(0, 205) + "..." : description}
                  </p>

                </div>

                {/* Extra Details */}
                <div className="mt-5 flex justify-between text-sm text-gray-800">
                  <div className="space-y-5">
                    <p className="flex items-center">
                      <FaStore className="mr-2 text-gray-600" /> Brand: {brand}
                    </p>
                    <p className="flex items-center">
                      <FaClock className="mr-2 text-gray-600" /> Added: {moment(
                        createdAt
                      ).fromNow()}
                    </p>
                    <p className="flex items-center">
                      <FaStar className="mr-2 text-gray-600" /> Reviews:{" "}
                      {numReviews}
                    </p>
                  </div>

                  <div className="space-y-5">
                    <p className="flex items-center">
                      <FaStar className="mr-2 text-gray-600" /> Ratings:{" "}
                      {Math.round(rating)}
                    </p>
                    <p className="flex items-center">
                      <FaShoppingCart className="mr-2 text-gray-600" /> Quantity:{" "}
                      {quantity}
                    </p>
                    <p className="flex items-center">
                      <FaBox className="mr-2 text-gray-600" /> In Stock:{" "}
                      {countInStock}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
