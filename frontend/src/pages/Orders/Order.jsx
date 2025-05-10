import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetRazorpayClientIdQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
  useCreateRazorpayOrderMutation
} from "../../redux/api/orderApiSlice";

import axios from "axios";
import { ORDERS_URL } from "../../redux/constants";
import ProductTabs from "../Products/ProductTabs";
import {
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);


  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const [createRazorpayOrder, { isLoading: loadingRazorpay }] = useCreateRazorpayOrderMutation();

  // const {
  //   data: paypal,
  //   isLoading: loadingPaPal,
  //   error: errorPayPal,
  // } = useGetPaypalClientIdQuery();

  const {
    data: razorpay,
    isLoading: loadingRazorpayID,
    error: errorRazorpayID,
  } = useGetRazorpayClientIdQuery();

  const razorpayHandler = async () => {
    try {
      const amount = cart.totalPrice;
      // console.log("Amount:", amount);
      // console.log("Razorpay data:", razorpay);
      const { data } = await createRazorpayOrder({ amount });
      // console.log("Razorpay order data:", data);
      paymentVerification(data);
    } catch (error) {
      console.error("Order Error:", error);
      const errorMessage = error.data?.message || "Failed to place order";
      toast.error(errorMessage);
    }
  };

  const paymentVerification = async (data) => {
    // Check if the Razorpay key is available
    // if (!razorpay || !razorpay.key_id) {
    //   toast.error("Payment configuration not loaded. Please try again later.");
    //   return;
    // }


    const options = {
      key: razorpay.key_id,
      amount: data.amount, // Already in paise, as returned from the create order endpoint
      currency: data.currency,
      name: "Store",
      description: "Store Payment for Order ID: " + data.id,
      order_id: data.id,
      handler: async (response) => {
        // console.log("Payment response:", response);
        try {
          // Pass the order id from our order (data.id) and Razorpay payment details for verification.
          const res = await axios.post(
            `${ORDERS_URL}/razorpay/verify`,
            {
              orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const verifyData = res.data;
          if (verifyData.message) {
            toast.success(verifyData.message);
            window.location.href = `/order/${orderId}`;
            // Optionally, call additional functions like PaymentHistory if needed.
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          toast.error("Payment verification failed. Please try again.");
        }
      },
      prefill: {
        name: userInfo.username,
        email: userInfo.email,
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
        paylater: true,
      },
    };

    // Create the Razorpay instance and open the checkout
    const rzp1 = new window.Razorpay(options);
    rzp1.open();

    // Handle payment failure
    rzp1.on("payment.failed", (response) => {
      console.error("Payment failed:", response.error);
      toast.error("Payment failed. Please try again.");
    });
  };


  // useEffect(() => {
  //   if (!errorPayPal && !loadingPaPal && paypal.clientId) {
  //     const loadingPaPalScript = async () => {
  //       paypalDispatch({
  //         type: "resetOptions",
  //         value: {
  //           "client-id": paypal.clientId,
  //           currency: "INR",
  //         },
  //       });
  //       paypalDispatch({ type: "setLoadingStatus", value: "pending" });
  //     };

  //     if (order && !order.isPaid) {
  //       if (!window.paypal) {
  //         loadingPaPalScript();
  //       }
  //     }
  //   }
  // }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  // Reating and Submit Reviews
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!selectedProductId || rating === 0 || comment.trim() === "") {
        toast.error("Please fill in all fields");
        return;
      }
      // console.log("Submitting review for product ID:", selectedProductId);
      await createReview({ selectedProductId, rating, comment }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setShowReviewModal(false);
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };




  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="container flex flex-col items-center">
      <div className="md:w-3/4 pr-4">
        <div className=" gray-300 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Messsage>Order is empty</Messsage>
          ) : (
            <div className="overflow-x-auto">
              <table className="border w-full border-separate border-spacing-x-4">
                <thead className="">
                  <tr>
                    <th className="px-3 py-4 text-center align-middle font-semibold text-xl">Image</th>
                    <th className="px-3 py-4 text-center align-middle font-semibold text-xl">Product</th>
                    <th className="px-3 py-4 text-center align-middle font-semibold text-xl">Quantity</th>
                    <th className="px-3 py-4 text-center align-middle font-semibold text-xl">Unit Price</th>
                    <th className="px-3 py-4 text-center align-middle font-semibold text-xl">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="md:w-40 w-32 h-28 object-contain bg-white mx-auto"
                        />
                      </td>

                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>

                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">{item.price}</td>
                      <td className="p-2 text-center">
                        ₹ {(item.qty * item.price).toFixed(2)}
                      </td>
                      {order.isPaid && order.isDelivered && userInfo._id === order.user._id && (
                        <td className="p-2 text-center">
                          <button
                            onClick={() => {
                              // console.log(item.product);
                              setSelectedProductId(item.product);
                              // console.log("Selected Product ID:", selectedProductId);
                              setShowReviewModal(true);
                            }}
                            className="bg-green-600 text-white py-2 px-4 rounded"
                          >
                            Write a Review
                          </button>
                        </td>
                      )}

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-2/4 flex justify-between items-center">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Name:</strong>{" "}
            {order.user.username}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Email:</strong> {order.user.email}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Method:</strong>{" "}
            {order.paymentMethod}
          </p>
          <div className="mb-5">
            {order.isPaid ? (
              <Messsage variant="success">Paid on {order.paidAt}</Messsage>
            ) : (
              <Messsage variant="danger">Not paid</Messsage>
            )}
          </div>

          {loadingDeliver && <Loader />}
          {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <div>
              <button
                type="button"
                className="bg-pink-500 text-white w-full py-2"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            </div>
          )}
        </div>

        <div className="w-1/3 h-fit bg-slate-400 rounded-md px-5">
          <h2 className="text-xl font-bold mb-2 mt-5">Order Summary</h2>
          <div className="flex justify-between mb-2 font-bold">
            <span>Items</span>
            <span>₹ {order.itemsPrice}</span>
          </div>
          <div className="flex justify-between mb-2 font-bold">
            <span>Shipping</span>
            <span>₹ {order.shippingPrice}</span>
          </div>
          <div className="flex justify-between mb-2 font-bold">
            <span>Tax</span>
            <span>₹ {order.taxPrice}</span>
          </div>
          <hr className="border-black border-2" />
          <div className="flex justify-between mb-5 font-bold">
            <span>Total</span>
            <span>₹ {order.totalPrice}</span>
          </div>

          {!order.isPaid && (
            <div>
              {loadingPay && <Loader />}{" "}
              {isPending ? (
                <Loader />
              ) : (
                <div>
                  <button
                    className={`w-full p-1 h-10 rounded-md mt-4 text-white font-medium flex items-center justify-center bg-pink-500 mb-5`}
                    onClick={razorpayHandler}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  >
                    Pay now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl">     
            <div ClassName="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem]">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                setShowReviewModal={setShowReviewModal}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Order;