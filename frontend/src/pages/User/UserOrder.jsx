import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
    const { data: orders, isLoading, error } = useGetMyOrdersQuery();

    return (
        <div className="ml-20">
            <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error?.data?.error || error.error}</Message>
            ) : (
                <table className="w-full border-separate border-spacing-x-4">
                    <thead>
                        <tr>
                            <th className="px-3 py-4 text-center align-middle font-semibold text-xl">
                                IMAGE
                            </th>
                            <th className="px-3 py-4 text-center align-middle font-semibold text-xl">
                                ID
                            </th>
                            <th className="px-3 py-4 text-center align-middle font-semibold text-xl">
                                DATE
                            </th>
                            <th className="px-3 py-4 text-center align-middle font-semibold text-xl">
                                TOTAL
                            </th>
                            <th className="px-3 py-4 text-center align-middle font-semibold text-xl">
                                PAID
                            </th>
                            <th className="px-3 py-4 text-center align-middle font-semibold text-xl">
                                DELIVERED
                            </th>
                            <th className="px-3 py-4 text-center align-middle font-semibold text-xl">
                                {/* Empty header for actions */}
                            </th>
                        </tr>
                    </thead>

                    <tbody className="text-center">
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td className="p-2 align-middle">
                                    <img
                                        src={order.orderItems[0].image}
                                        alt={order.user}
                                        className="md:w-40 w-32 h-28 object-contain bg-white mx-auto"
                                    />
                                </td>
                                <td className="py-2 align-middle">{order._id}</td>
                                <td className="py-2 align-middle">
                                    {order.createdAt.substring(0, 10)}
                                </td>
                                <td className="py-2 align-middle">$ {order.totalPrice}</td>
                                <td className="py-2 text-center">
                                    {order.isPaid ? (
                                        <span className="inline-block p-1 bg-green-400 w-[6rem] rounded-full">
                                            Completed
                                        </span>
                                    ) : (
                                        <span className="inline-block p-1 bg-red-400 w-[6rem] rounded-full">
                                            Pending
                                        </span>
                                    )}
                                </td>


                                <td className="py-2 text-center" >
                                    {order.isDelivered ? (
                                        <span className="inline-block p-1 bg-green-400 w-[6rem] rounded-full">
                                        Completed
                                    </span>
                                ) : (
                                    <span className="inline-block p-1 bg-red-400 w-[6rem] rounded-full">
                                        Pending
                                    </span>
                                    )}
                                </td>
                                <td className="py-2 align-middle">
                                    <Link to={`/order/${order._id}`}>
                                        <button className="bg-pink-400 text-black py-2 px-3 rounded">
                                            View Details
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserOrder;
