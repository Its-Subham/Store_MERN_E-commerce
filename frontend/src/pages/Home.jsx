import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery, useGetLatestProductsQuery } from "../redux/api/productApiSlice.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import Header from "../components/Header.jsx";
import Product from "./Products/Product.jsx";
import Footer from "./Footer.jsx";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
  const { data: latestProducts, isLoading: loadingLatestProducts } = useGetLatestProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="ml-[9rem] mt-[5rem] text-[3rem]">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[5rem]"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="flex justify-center flex-wrap mt-[2rem]">
              {data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Latest Products  */}
          <div>
            <h1 className="ml-[9rem] mt-[5rem] text-[3rem]">
              Latest Products
            </h1>

            <div className="flex justify-center flex-wrap mt-[2rem]">
              {latestProducts.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>

        </>
      )}
      <Footer />
    </>
  );
};

export default Home;