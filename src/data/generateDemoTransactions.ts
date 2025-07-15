import { uid } from "uid"; // Import the uid function for ID generation

// Function to generate demo transaction data
export default function generateDemoTransactions(count = 1000) {
  const statuses = ["Completed", "Pending", "Failed"];
  const paymentMethods = ["Credit Card", "PayPal", "Bank Transfer", "Cash"];
  const customers = [
    "John Smith",
    "Alice Brown",
    "Charlie Lee",
    "Emily Davis",
    "Frank Miller",
    "Grace Wilson",
  ];

  // Function to generate a random date (for transaction date)
  const generateRandomDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return new Date(start + Math.random() * (end - start))
      .toISOString()
      .split("T")[0]; // Random date between start and end
  };

  // Function to generate random amount for transaction
  const generateRandomAmount = () => {
    return (Math.random() * (1000 - 50) + 50).toFixed(2); // Random amount between $50 and $1000
  };

  // Function to generate transaction data
  return Array.from({ length: count }, () => {
    const transactionId = uid(8)?.toUpperCase(); // Generate unique ID with 6 characters
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomPaymentMethod =
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const randomCustomer =
      customers[Math.floor(Math.random() * customers.length)];
    const transactionDate = generateRandomDate("2023-01-01", "2025-01-01");
    const amount = generateRandomAmount();

    return {
      id: transactionId,
      customerName: randomCustomer,
      amount,
      paymentMethod: randomPaymentMethod,
      transactionDate,
      status: randomStatus,
    };
  });
}
