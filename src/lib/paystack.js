// Thin wrapper around the Paystack Inline JS popup (loaded via <script> in index.html)

export function payWithPaystack({ email, amountNaira, reference, onSuccess, onClose }) {
  if (!window.PaystackPop) {
    alert("Payment system is still loading — please wait a moment and try again.");
    return;
  }

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  if (!publicKey) {
    alert("Payment is not configured yet (missing Paystack public key).");
    return;
  }

  const popup = new window.PaystackPop();
  popup.newTransaction({
    key: publicKey,
    email,
    amount: Math.round(amountNaira * 100), // Paystack expects kobo
    currency: "NGN",
    reference,
    onSuccess: (transaction) => onSuccess(transaction.reference),
    onCancel: () => onClose && onClose(),
  });
}
