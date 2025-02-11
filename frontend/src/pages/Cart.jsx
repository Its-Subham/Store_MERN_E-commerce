import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { useFetchCategorieByIdQuery } from "../redux/api/categoryApiSlice";

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate("/login?redirect=/shipping");
    };

    return (
        <>
            <div className="container flex justify-around items-start flex-wrap  ">
                {cartItems.length === 0 ? (
                    <div>
                        Your cart is empty <Link to="/shop">Go To Shop</Link>
                    </div>
                ) : (
                    <>
                        <div className="flex  w-[80%] justify-around  items-center flex-wrap my-5">
                            <div className="w-3/4">
                                <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

                                {cartItems.map((item) => {
    const { data: categoryData, isLoading, error } = useFetchCategorieByIdQuery(item.category);

    // console.log("Category Data for", item.category, ":", categoryData); // Debugging log

    return (
        <div key={item._id} className="flex items-center mb-[1rem] pb-2">
            <div className="w-[10rem] h-[8rem]">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain rounded bg-white"
                />
            </div>

            <div className="flex-1 ml-4">
                <Link to={`/product/${item._id}`} className="text-pink-500">
                    {item.name}
                </Link>

                <div className="mt-2 text-white">{item.brand}</div>

                {/* Show loading, error, or category name */}
                <div className="mt-2 text-white">
                    {isLoading ? "Loading..." : error ? "Error fetching category" : categoryData?.name}
                </div>

                <div className="mt-2 text-white font-bold">
                    $ {item.price}
                </div>
            </div>

            <div className="w-24">
                <select
                    className="w-full p-1 border rounded text-black"
                    value={item.qty}
                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                >
                    {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                            {x + 1}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <button
                    className="text-red-500 mr-[5rem]"
                    onClick={() => removeFromCartHandler(item._id)}
                >
                    <FaTrash className="ml-[1rem] mt-[.5rem]" />
                </button>
            </div>
        </div>
    );
})}



                                {/* <div className="mt-8 w-[40rem]">
                                    <div className="p-4 rounded-lg">
                                        <h2 className="text-xl font-semibold mb-2">
                                            Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                                        </h2>

                                        <div className="text-2xl font-bold">
                                            ₹{" "}
                                            {cartItems
                                                .reduce((acc, item) => acc + item.qty * item.price, 0)
                                                .toFixed(2)}
                                        </div>

                                        <button
                                            className="bg-pink-500 mt-4 py-2 px-4 rounded-full text-lg w-full"
                                            disabled={cartItems.length === 0}
                                            onClick={checkoutHandler}
                                        >
                                            Proceed To Checkout
                                        </button>
                                    </div>
                                </div> */}
                            </div>
                            <div className="bg-slate-300 w-1/4 h-fit rounded-md ">
                                <div>
                                    <h1 className="text-2xl font-semibold pt-2 pl-7">Price Details</h1>

                                    <hr className="bg-slate-600 h-[1px] border-0" />

                                    <h1 className="text-lg font-semibold pt-2 pl-7">
                                        Total Items: {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                    </h1>

                                    <h1 className="text-lg font-semibold pt-2 pl-7">
                                        Price ({cartItems.reduce((acc, item) => acc + item.qty, 0)} item): ₹{" "}
                                        {cartItems
                                            .reduce((acc, item) => acc + item.qty * item.price, 0)
                                            .toFixed(2)}
                                    </h1>

                                    <h1 className="text-lg font-semibold py-2 pl-7">
                                        Delivery Charges: <span className="text-lime-700">free</span>
                                    </h1>

                                    <hr className="bg-slate-600 h-[1px] border-0" />

                                    <h1 className="text-2xl font-semibold pt-2 pl-7">Total Price : ₹ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</h1>

                                    <div className="lg:my-6 lg:mx-2">
                                        <button
                                            className="bg-pink-500 py-2 px-4 rounded-full text-lg w-full"
                                            disabled={cartItems.length === 0}
                                            onClick={checkoutHandler}
                                        >
                                            Proceed To Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}



            </div>
        </>
    );
};

export default Cart;