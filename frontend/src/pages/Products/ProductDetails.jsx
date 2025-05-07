import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    useGetProductDetailsQuery,
    useCreateReviewMutation,
    useGetSimilarProductsQuery,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
    FaShoppingCart,
    FaStar,
    FaStore,
    FaMoneyBillWaveAlt,
    FaTruck,
    FaShopify,
    FaAngleLeft,
    FaAngleRight,

} from "react-icons/fa";
import { IoReturnDownBack } from "react-icons/io5";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviewPage, setReviewPage] = useState(1);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const reviewsPerPage = 5;

    const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
    const categoryID = product?.category;
    const { data: similarProducts, isLoading: loadingSimilarProducts } = useGetSimilarProductsQuery(categoryID, { skip: !categoryID });
    const { userInfo } = useSelector((state) => state.auth);
    const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
    const sliderRef = useRef(null);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await createReview({ productId, rating, comment }).unwrap();
            refetch();
            toast.success("Review created successfully");
        } catch (error) {
            toast.error(error?.data || error.message);
        }
    };

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate("/cart");
    };

    useEffect(() => {
        const handleScroll = () => {
            if (sliderRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
                setCanScrollLeft(scrollLeft > 0);
                setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); // Ensure it correctly updates
            }
        };

        if (sliderRef.current) {
            sliderRef.current.addEventListener("scroll", handleScroll);
            handleScroll();
        }

        return () => sliderRef.current?.removeEventListener("scroll", handleScroll);
    }, [similarProducts]); // Make sure it runs when similarProducts change

    const slideLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const slideRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };


    return (
        <>
            <Link to="/" className="text-white font-semibold hover:underline ml-[10rem]">Go Back</Link>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error?.data?.message || error.message}</Message>
            ) : (
                <div className="flex gap-10 mx-[10rem] mt-10">
                    {/* Left Side - Product Image & Reviews */}
                    <div className="w-3/5 h-[80vh] sticky top-10 overflow-y-auto">
                        <div className="flex flex-col gap-4">
                            <div className="relative bg-white p-4 border border-gray-200 rounded-lg shadow-md">
                                <div className="flex justify-center items-center absolute top-3 right-3 h-10 w-10 rounded-full hover:shadow-md">
                                    <HeartIcon product={product} className="text-red-500 cursor-pointer" />
                                </div>
                                <img src={product.image} alt={product.name} className="w-full h-auto object-contain" />
                            </div>

                            <div className="flex space-x-4">
                                <button onClick={addToCartHandler} className="bg-pink-600 text-white py-2 px-4 rounded-lg flex-1 flex items-center justify-center">
                                    <FaShoppingCart className="mr-2" /> Add To Cart
                                </button>
                                <button onClick={addToCartHandler} className="bg-pink-600 text-white py-2 px-4 rounded-lg flex-1 flex items-center justify-center">
                                    <FaShopify className="mr-2" />
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Product Details */}
                    <div className="w-2/3">
                        <h2 className="text-2xl font-semibold">{product.name}</h2>
                        <p className="my-4 text-gray-500">{product.description}</p>
                        <p className="text-5xl my-4 font-extrabold">₹ {product.price}</p>
                        <h1 className="flex items-center mb-6"><FaStore className="mr-2" /> Brand: {product.brand}</h1>
                        {/* <h1 className="flex items-center mb-6"><FaStar className="mr-2" /> Reviews: {product.numReviews}</h1> */}
                        <Ratings
                            value={product.rating}
                            text={`${product.numReviews} reviews`}
                        />

                        {/*Services*/}
                        <div className="flex flex-wrap mt-3 text-lg font-medium">
                            <div className="flex items-center mr-6"><FaTruck className="mr-2" /> Free Delivery</div>
                            <div className="flex items-center mr-6"><IoReturnDownBack className="mr-2" /> 7-Day Return Policy</div>
                            <div className="flex items-center"><FaMoneyBillWaveAlt className="mr-2" /> Cash On Delivery</div>
                        </div>

                        {/* Reviews Section */}
                        <h2 className="text-2xl font-semibold mt-6">Customer Reviews</h2>
                        {product.reviews.slice(0, reviewPage * reviewsPerPage).map((review, index) => (
                            <div key={index} className="p-3 bg-gray-100 rounded-lg mt-3">
                                <h3 className="font-bold">{review.name}</h3>
                                <Ratings value={review.rating} />
                                <p>{review.comment}</p>
                                <span className="text-sm text-gray-500">{moment(review.createdAt).fromNow()}</span>
                            </div>
                        ))}
                        {reviewPage * reviewsPerPage < product.reviews.length && (
                            <button
                                onClick={() => setReviewPage((prev) => prev + 1)}
                                className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-lg w-full"
                            >
                                Show More Reviews
                            </button>
                        )}

                    </div>


                </div>
            )}

            {/* Similar Products */}
            {similarProducts?.filter((p) => p._id !== productId).length > 0 && (
                <div className="mt-10 mx-[10rem]">
                    <h2 className="text-2xl font-semibold mb-4">Similar Products</h2>
                    <div className="relative">
                        {canScrollLeft && (
                            <button onClick={slideLeft} className="absolute left-0 top-1/3 h-20 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full">
                                <FaAngleLeft className="text-2xl" />
                            </button>
                        )}
                        <div ref={sliderRef} className="flex overflow-x-auto gap-4 no-scrollbar pb-10">
                            {similarProducts.filter((p) => p._id !== productId).map((p) => (
                                <div key={p._id} className="border rounded-lg p-2 shadow-md min-w-[230px]">
                                    <Link to={`/product/${p._id}`} target="_blank">
                                        <img src={p.image} alt={p.name} className="w-full h-44 object-contain rounded bg-white" />
                                        <h3 className="mt-2 font-medium hover:text-blue-400">
                                            {p.name.length > 48 ? p.name.substring(0, 45) + "..." : p.name}

                                        </h3>
                                        <p className="text-lg font-bold">₹ {p.price}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        {canScrollRight && (
                            <button onClick={slideRight} className="absolute right-0 top-1/3 h-20 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full">
                                <FaAngleRight className="text-2xl" />
                            </button>
                        )}
                    </div>
                </div>
            )}


        </>
    );
};

export default ProductDetails;
