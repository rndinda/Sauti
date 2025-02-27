"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Database } from "@/types/db-schema";

type UserType = Database["public"]["Enums"]["user_type"];

export default function ChooseUser() {
	const [selectedType, setSelectedType] = useState<UserType | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const handleSubmit = async () => {
		if (!selectedType) return;

		setIsSubmitting(true);
		const supabase = createClient();

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("No user found");

			const { error } = await supabase
				.from("profiles")
				.update({ user_type: selectedType })
				.eq("id", user.id);

			if (error) throw error;

			// Refresh the page to reflect the new user type
			router.refresh();
		} catch (error) {
			console.error("Error updating user type:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-2xl font-bold text-center mt-14 sm:mt-8 mb-8 text-[#143A43]">
					Choose Your Role
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					{/* Survivor Tile */}
					<div
						className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-all ${
							selectedType === "survivor"
								? "border-teal-600 bg-teal-50"
								: "border-gray-200 hover:border-teal-600"
						}`}
						onClick={() => setSelectedType("survivor")}
					>
						<div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-0">
							<div className="w-20 sm:w-full aspect-square relative flex justify-center items-center">
								<Image
									src="/icons/survivor-light.png"
									alt="Survivor"
									className="object-contain"
									height={120}
									width={120}
								/>
							</div>
							<div className="flex-1 sm:w-full">
								<h3 className="font-semibold text-left sm:text-center">Survivor</h3>
								<p className="text-sm text-gray-600 text-left sm:text-center">
									Seeking support and resources
								</p>
							</div>
						</div>
					</div>

					{/* Professional Tile */}
					<div
						className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-all ${
							selectedType === "professional"
								? "border-teal-600 bg-teal-50"
								: "border-gray-200 hover:border-teal-600"
						}`}
						onClick={() => setSelectedType("professional")}
					>
						<div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-0">
							<div className="w-20 sm:w-full aspect-square relative flex justify-center items-center">
								<Image
									src="/icons/professional-light.png"
									alt="Professional"
									height={150}
									width={150}
									className="object-contain"
								/>
							</div>
							<div className="flex-1 sm:w-full">
								<h3 className="font-semibold text-left sm:text-center">Professional</h3>
								<p className="text-sm text-gray-600 text-left sm:text-center">
									Providing expert support
								</p>
							</div>
						</div>
					</div>

					{/* NGO Tile */}
					<div
						className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-all ${
							selectedType === "ngo"
								? "border-teal-600 bg-teal-50"
								: "border-gray-200 hover:border-teal-600"
						}`}
						onClick={() => setSelectedType("ngo")}
					>
						<div className="flex flex-row sm:flex-col items-center gap-4 sm:gap-0">
							<div className="w-20 sm:w-full aspect-square relative flex justify-center items-center">
								<Image
									src="/icons/ngo-light.png"
									alt="NGO"
									height={170}
									width={170}
									className="object-contain"
								/>
							</div>
							<div className="flex-1 sm:w-full">
								<h3 className="font-semibold text-left sm:text-center">NGO</h3>
								<p className="text-sm text-gray-600 text-left sm:text-center">
									Organization providing services
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Centered Continue Button */}
				<div className="flex justify-center">
					<Button
						onClick={handleSubmit}
						disabled={!selectedType || isSubmitting}
						className="bg-teal-600 hover:bg-teal-700 min-w-[200px]"
					>
						{isSubmitting ? "Updating..." : "Continue"}
					</Button>
				</div>
			</div>
		</div>
	);
}
