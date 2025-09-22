export const createInvoice = async (invoice: Record<string, unknown>) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(invoice)) {
    if (value === null || value === undefined) continue;

    if (key === "signature" && value) {
      // Accept File, Blob, or data URL string
      if (value instanceof File || value instanceof Blob) {
        const file = value as File;
        formData.append(
          "signature",
          file,
          (file as File).name || "signature.png"
        );
      } else if (typeof value === "string") {
        if (value.startsWith("data:")) {
          // Convert data URL to Blob
          const blob = await (await fetch(value)).blob();
          formData.append("signature", blob, "signature.png");
        } else {
          // If backend strictly expects a file, skip non-dataURL strings
          // to avoid validation errors.
          continue;
        }
      } else {
        continue;
      }
    } else {
      formData.append(key, String(value));
    }
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/logistics/invoice/`,
    {
      method: "POST",
      headers: {
        // Let the browser set Content-Type with boundary for multipart/form-data
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: formData,
    }
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `HTTP ${response.status}: ${text || "Failed to create invoice"}`
    );
  }
  return response.json();
};
