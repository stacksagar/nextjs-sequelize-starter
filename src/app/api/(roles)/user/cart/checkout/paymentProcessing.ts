const paymentProcessing = () => {
  // Simulate payment processing logic
  return new Promise(
    (resolve: ({ success }: { success?: boolean }) => void) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 200);
    }
  );
};


export default paymentProcessing