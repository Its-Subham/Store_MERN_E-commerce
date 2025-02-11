import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useFetchCategorieByIdQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";


const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const { data: categoryData, isLoading, error } = useFetchCategorieByIdQuery(p.category);

  return (
    <div className="max-w-xs max-h-[400px] relative bg-[#1A1A1A] rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          {/* <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            {p?.brand}
          </span> */}
          <img
            className="cursor-pointer w-full object-contain h-[170px] bg-white rounded-t-lg py-3"
            src={p.image}
            alt={p.name}
          />
        </Link>

        {/* Heart icon positioned at the top-right */}
        <div className="absolute top-3 right-3">
          <HeartIcon product={p} />
        </div>
      </section>


      <div className="p-5">
        <div className="flex items-center gap-4 mb-2">
          <span className="bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            {p?.brand}
          </span>
          <span className=" bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            {categoryData?.name}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <h5 className="mb-2 text-xl text-white dark:text-white font-semibold">
            {p?.name.length > 30 ? p?.name.substring(0, 30) + "..." : p?.name}
          </h5>

          <p className="text-lg font-semibold text-pink-500">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "INR",
            })}
          </p>
        </div>

        <p className="mb-3 text-sm font-normal text-gray-300">
          {p?.description?.substring(0, 70)}...
        </p>

        <section className="flex justify-between items-center">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800 transition duration-200"
          >
            Read More
            <svg
              className="w-4 h-4 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition duration-200"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={25} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
