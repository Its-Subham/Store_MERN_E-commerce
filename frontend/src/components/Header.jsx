import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct.jsx";
import ProductCarousel from "../pages/Products/ProductCarousel.jsx";

const Header = () => {
    const { data, isLoading, error } = useGetTopProductsQuery();

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <h1>ERROR</h1>;
    }

    return (
        <>
            {/* <div className="flex justify-around">
                <div className="xl:block lg:hidden md:hidden:sm:hidden">
                    <div className="grid grid-cols-2">
                        {data.map((product) => (
                            <div key={product._id}>
                                <SmallProduct product={product} />
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <ProductCarousel />
                </div>
            </div> */}

            <div className="flex justify-around items-center">
                {/* Left Section - Small Products */}
                <div className="grid grid-cols-2">
                    {data.map((product) => (
                        <SmallProduct key={product._id} product={product} />
                    ))}
                </div>


                {/* Right Section - Product Carousel */}
                <div className="">
                    <ProductCarousel />
                </div>
            </div>

        </>
    );
};

export default Header;