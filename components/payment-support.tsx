import {
  FaApplePay,
  FaCcAmex,
  FaCcMastercard,
  FaCcVisa,
  FaGooglePay,
  FaPaypal,
} from "react-icons/fa";
import { SiBit } from "react-icons/si";
// hello
export function PaymentSupport() {
  return (
    <div className="border-t border-black/10 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-5 text-white">
          <FaCcVisa className="h-7 w-auto" aria-label="Visa" />
          <FaPaypal className="h-7 w-auto" aria-label="PayPal" />
          <FaCcMastercard className="h-7 w-auto" aria-label="Mastercard" />
          <FaCcAmex className="h-7 w-auto" aria-label="American Express" />
          <span
            className="pointer-events-none select-none text-xs font-bold tracking-tight"
            aria-label="Isracard"
          >
            ישראכרט
          </span>
          <SiBit className="h-7 w-auto" aria-label="Bit" />
          <FaApplePay className="h-7 w-auto" aria-label="Apple Pay" />
          <FaGooglePay className="h-7 w-auto" aria-label="Google Pay" />
        </div>
      </div>
    </div>
  );
}
