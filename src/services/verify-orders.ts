interface VerifyOrdersParams {
  order_ids: number[];
  status: string;
}

export const verifyOrders = async (params: VerifyOrdersParams) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/logistics/update-order-status/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(params),
      }
    );
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
