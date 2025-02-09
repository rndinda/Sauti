// app/dashboard/_components/tabs/AppointmentsTab.tsx
import { useEffect, useState } from "react";
import { AppointmentCard } from "../AppointmentCard";
import { fetchUserAppointments } from "../../_views/actions/appointments";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/types/db-schema";

interface AppointmentWithDetails {
	id: string;
	appointment_date: string;
	status: string;
	matched_service: {
		support_service: Tables<"support_services">;
	};
}

export function AppointmentsTab({
	userId,
	userType,
}: {
	userId: string;
	userType: "professional" | "survivor";
}) {
	const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	const loadAppointments = async () => {
		try {
			const data = await fetchUserAppointments(userId, userType);
			setAppointments(data);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to load appointments. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadAppointments();
	}, [userId, userType]);

	if (isLoading) {
		return <div>Loading appointments...</div>;
	}

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold">Your Appointments</h2>

			{appointments.length > 0 ? (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{appointments.map((appointment) => (
						<AppointmentCard
							key={appointment.id}
							appointment={appointment}
							onStatusUpdate={loadAppointments}
						/>
					))}
				</div>
			) : (
				<div className="text-center py-12 bg-gray-50 rounded-lg">
					<p className="text-gray-500">No appointments scheduled yet</p>
					<p className="text-sm text-gray-400 mt-2">
						Appointments will appear here once they are scheduled
					</p>
				</div>
			)}
		</div>
	);
}
