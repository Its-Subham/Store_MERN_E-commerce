import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";



const PlaceOrder = () => {
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();
    

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate("/shipping");
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const dispatch = useDispatch();

    const placeOrderHandler = async () => {
        try {
            // Add validation check before submitting
            if (!cart.paymentMethod) {
                toast.error("Please select a payment method");
                return navigate("/payment");
            }

            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();


            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (error) {
            // Improved error handling
            console.error("Order Error:", error);
            const errorMessage = error.data?.message || "Failed to place order";
            toast.error(errorMessage);
        }
    };

    


return (
    <>
        <ProgressSteps step1 step2 step3 />

        <div className="container mx-auto mt-8">
            {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
            ) : (
                <div className="flex justify-around">
                    <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-x-4">
                            <thead>
                                <tr>
                                    <td className="px-3 py-4 text-center align-middle font-semibold text-xl">
                                        Image
                                    </td>
                                    <td className="px-3 py-4 text-center align-middle font-semibold text-xl">
                                        Product
                                    </td>
                                    <td className="px-3 py-4 text-center align-middle font-semibold text-xl">
                                        Quantity
                                    </td>
                                    <td className="px-3 py-4 text-center align-middle font-semibold text-xl">
                                        Price
                                    </td>
                                    <td className="px-3 py-4 text-center align-middle font-semibold text-xl">
                                        Total
                                    </td>
                                </tr>
                            </thead>

                            <tbody>
                                {cart.cartItems.map((item, index) => (
                                    <tr key={index} className="">
                                        <td className="p-3 text-center align-middle">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="md:w-40 w-32 h-28 object-contain bg-white mx-auto"
                                            />
                                        </td>
                                        <td className="p-3 text-center align-middle">
                                            <Link to={`/product/${item._id}`}>{item.name}</Link>
                                        </td>
                                        <td className="p-3 text-center align-middle">{item.qty}</td>
                                        <td className="p-3 text-center align-middle">
                                            ₹{item.price.toFixed(2)}
                                        </td>
                                        <td className="p-3 text-center align-middle">
                                            ₹{(item.qty * item.price).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                    <div className="max-w-80">

                        <div className="flex flex-col flex-wrap gap-4 p-8 bg-gray-300 rounded-lg ">
                            <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
                            <ul className="text-lg">
                                <li>
                                    <span className="font-semibold mb-4">Items:</span> ₹
                                    {cart.itemsPrice}
                                </li>
                                <li>
                                    <span className="font-semibold mb-4">Shipping:</span> ₹
                                    {cart.shippingPrice}
                                </li>
                                <li>
                                    <span className="font-semibold mb-4">Tax:</span> ₹
                                    {cart.taxPrice}
                                </li>
                                <li>
                                    <span className="font-semibold mb-4">Total:</span> ₹
                                    {cart.totalPrice}
                                </li>
                            </ul>

                            {error && <Message variant="danger">{error.data.message}</Message>}

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
                                <p>
                                    <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                                    {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                                    {cart.shippingAddress.country}
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
                                <strong>Method:</strong> {cart.paymentMethod}
                            </div>
                        </div>

                        <button
                            type="button"
                            className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
                            disabled={cart.cartItems.length === 0} // Fixed disabled condition
                            onClick={placeOrderHandler}
                        >
                            Place Order
                        </button>


                        {isLoading && <Loader />}
                    </div>
                </div>
            )}
        </div>
    </>
);
};

export default PlaceOrder;