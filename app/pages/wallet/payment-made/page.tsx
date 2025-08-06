// app/pages/wallet/payment-made/page.tsx

import { Suspense } from "react";
import PaymentMadeClient from "./PaymentMadeClient";

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PaymentMadeClient />
		</Suspense>
	);
}
