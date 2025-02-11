import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-[25rem] ml-[2rem] p-3 relative">
      <div className="relative bg-slate-50 rounded-md">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-[25rem] h-[15rem] rounded object-contain py-4"
          />
        </Link>
        <div className="absolute top-3 right-3">
          <HeartIcon product={product} />
        </div>
      </div>

      {/* <div className="p-4 flex flex-wrap justify-between items-center gap-4">
        <Link
          to={`/product/${product._id}`}
          className="text-lg font-semibold text-gray-800"
          aria-label={`View details for ${product.name}`}
        >
          <div>
            <h2 className="">
              {product.name}
            </h2>
          </div>

          <div>
            <span className="bg-pink-100 text-pink-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-pink-900 dark:text-pink-300 shadow-md whitespace-nowrap">
              ₹ {product.price.toLocaleString("en-IN")}
            </span>
          </div>
        </Link>
      </div> */}


      <Link
        to={`/product/${product._id}`}
        aria-label={`View details for ${product.name}`}
      >
        <div className="flex m-3 justify-between items-center gap-4">
          <div className="flex-1 text-lg font-semibold text-gray-900">{product.name}</div>
          <div className="w-24 h-10 flex items-center justify-center bg-pink-100 text-pink-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-pink-900 dark:text-pink-300 shadow-md whitespace-nowrap">
            ₹ {product.price.toLocaleString("en-IN")}
          </div>
        </div>
      </Link>



    </div>
  );
};

export default Product;
