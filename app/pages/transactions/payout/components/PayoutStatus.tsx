import axios from "@/app/lib/axios";
import { Spinner } from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { usePayout } from "../../_features/hook";

interface Props {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	uniqueId: string;
	payout: boolean;
}

const PayoutStatus: React.FC<Props> = ({ setOpen, uniqueId, payout }) => {
	const menuRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();

	const { mutate: runPayout, isPending: isPendingPayout } = usePayout({ axios });

	const onSubmitPayout = (e: React.FormEvent) => {
		e.preventDefault();
		runPayout(
			{ payoutId: uniqueId, payoutStatus: "paid" },
			{
				onSuccess: () => {
					void queryClient.invalidateQueries({ queryKey: ["admin-payout"] });
					void queryClient.invalidateQueries({ queryKey: ["admin-payout-summary"] });
					toast.success("Payout completed");
					setOpen(false);
				},
				onError: (error: Error) => {
					toast.error(error?.message || "Failed to process payout");
				},
			}
		);
	};

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [setOpen]);

	return (
		<div>
			<div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 z-40" aria-hidden />

			<div
				ref={menuRef}
				className="bg-white p-6 rounded-md shadow-md w-82 md:w-full max-w-xl z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
				role="dialog"
				aria-modal="true"
				aria-labelledby="payout-status-title"
			>
				<div className="flex justify-center mt-5">
					{payout && (
						<div className="bg-blue-100 rounded-full px-3 py-3">
							<Check size={15} className="text-blue-600" aria-hidden />
						</div>
					)}
				</div>

				<h2 id="payout-status-title" className="flex justify-center mt-5 text-lg font-semibold ml-3">
					Payout status
				</h2>

				<form onSubmit={payout ? onSubmitPayout : (e) => e.preventDefault()} className="space-y-4 mt-5 lg:mt-12">
					<div className="flex justify-between mt-8 gap-2">
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="w-1/2 hover:cursor-pointer py-2 bg-gray-100 rounded-md hover:text-white hover:bg-blue-600"
						>
							Cancel
						</button>

						{payout && (
							<button
								type="submit"
								disabled={isPendingPayout}
								className="flex justify-center items-center w-1/2 py-2 rounded-md text-white bg-blue-600 hover:cursor-pointer disabled:opacity-60"
							>
								{isPendingPayout ? (
									<Spinner className="mr-1 inline" />
								) : (
									<Check size={14} className="mr-1 inline" aria-hidden />
								)}
								{isPendingPayout ? "Processing…" : "Payout"}
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
};

export default PayoutStatus;
