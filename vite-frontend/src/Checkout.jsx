import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Crown, Loader2, CheckCircle2, XCircle, ArrowLeft, Download, Wallet } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const gatewayNames = {
  nagad: "Nagad",
  rupantorpay: "RupantorPay",
  uddokta: "Uddokta",
  bkash: "bKash",
  paddle: "Paddle",
};

function CheckoutContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planName = searchParams.get("plan");
  const status = searchParams.get("status");

  const [plan, setPlan] = useState(null);
  const [gateways, setGateways] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    if (status === "success") {
      return;
    }

    if (!planName) {
      setError("No plan specified");
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`${API}/api/subscription/plans`).then((r) => r.json()),
      fetch(`${API}/api/payment/gateways`).then((r) => r.json()),
    ])
      .then(([plansData, gatewaysData]) => {
        const found = plansData.plans?.find(
          (p) => p.name.toLowerCase() === planName.toLowerCase()
        );
        if (found) {
          setPlan(found);
        } else {
          setError(`Plan "${planName}" not found`);
        }
        const active = (gatewaysData.gateways || []).filter((g) => g.isActive);
        setGateways(active);
        if (active.length > 0) setSelectedGateway(active[0].provider);
      })
      .catch(() => setError("Failed to load plan details"))
      .finally(() => setLoading(false));
  }, [planName, status, navigate]);

  const handlePay = async () => {
    if (!plan || !selectedGateway) return;
    setPaying(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/payment/${selectedGateway}/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId: plan.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment initiation failed");

      window.location.href = data.callBackUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setPaying(false);
    }
  };

  const handleStartFree = async () => {
    if (!plan) return;
    setPaying(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/subscription/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId: plan.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to activate free plan");
      }

      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate free plan");
      setPaying(false);
    }
  };

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F9] p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-gray-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful!</h2>
          <p className="mt-2 text-gray-500">
            Your subscription is now active. Enjoy premium downloads!
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl"
          >
            <Download className="h-4 w-4" />
            Start Downloading
          </button>
        </div>
      </div>
    );
  }

  if (status === "failed" || status === "aborted") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F9] p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-gray-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Failed</h2>
          <p className="mt-2 text-gray-500">
            {status === "aborted"
              ? "You cancelled the payment. Please try again."
              : "Something went wrong with your payment. Please try again."}
          </p>
          <button
            onClick={() => navigate("/#pricing")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-bold text-gray-700 transition-all hover:border-brand-200 hover:bg-brand-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F9] p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/#pricing")}
          className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to plans
        </button>

        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
                <p className="text-sm text-gray-500">Choose your payment method</p>
            </div>
          </div>

          {loading ? (
            <div className="mt-8 flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
            </div>
          ) : error ? (
            <div className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          ) : plan ? (
            <>
              <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Plan</span>
                  <span className="font-bold text-gray-900">{plan.name}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Billing</span>
                  <span className="font-medium text-gray-700">
                    {plan.interval === "YEARLY" ? "Yearly" : "Monthly"}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2">
                  <span className="text-sm text-gray-500">Amount</span>
                  <span className="text-xl font-extrabold text-gray-900">
                    {plan.currency === "BDT" ? "৳" : "$"}
                    {plan.price.toFixed(2)}
                  </span>
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                {plan.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>

              {plan.price === 0 ? (
                <button
                  onClick={handleStartFree}
                  disabled={paying}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                >
                  {paying ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                  {paying ? "Activating..." : "Start Free"}
                </button>
              ) : gateways.length > 0 ? (
                <>
                  <div className="mt-5 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Choose payment method</p>
                    {gateways.map((gw) => (
                      <button
                        key={gw.provider}
                        onClick={() => setSelectedGateway(gw.provider)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                          selectedGateway === gw.provider
                            ? "border-brand-300 bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          selectedGateway === gw.provider
                            ? "bg-gradient-to-br from-brand-500 to-accent-500"
                            : "bg-gray-100"
                        }`}>
                          <Wallet className={`h-4 w-4 ${selectedGateway === gw.provider ? "text-white" : "text-gray-400"}`} />
                        </div>
                        <span className="font-medium">{gatewayNames[gw.provider] || gw.label}</span>
                        {selectedGateway === gw.provider && (
                          <CheckCircle2 className="ml-auto h-4 w-4 text-brand-600" />
                        )}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handlePay}
                    disabled={paying}
                    className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-60"
                  >
                    {paying ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Wallet className="h-5 w-5" />
                    )}
                    {paying ? "Processing..." : `Pay ৳${plan.price.toFixed(2)}`}
                  </button>
                </>
              ) : (
                <p className="mt-4 text-center text-xs text-gray-400">No payment gateways available</p>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F9] p-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
