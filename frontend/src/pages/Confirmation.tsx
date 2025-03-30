import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { confirmAppointment } from "../features/appointments/action";
import { Button } from "../components/ui/button";

function ConfirmationStatus() {
    const [loading, setLoading] = useState(false);
    const [found, setFound] = useState(true);
    const [status, setStatus] = useState<string | undefined>();
    const { appointmentId } = useParams();

    useEffect(() => {
        setLoading(true);
        if (!appointmentId) {
            setFound(false);
            setLoading(false);
            return;
        }
        (async () => {
            try {
                const res = await confirmAppointment(appointmentId);
                setStatus(res.order_status);
            } catch (_error) {
                setFound(false);
            } finally {
                setLoading(false);
            }
        })();
    }, [appointmentId]);

    if (loading) {
        return <div className="text-center text-purple-600 text-lg font-semibold">Loading...</div>;
    }

    if (!found) {
        return <div className="text-center text-red-500 text-lg font-semibold">Appointment not found</div>;
    }

    return (
        <div className="flex flex-col items-center space-y-4 bg-purple-100 p-6 rounded-lg shadow-md">
            {status === "PAID" ? (
                <div className="text-green-600 text-xl font-semibold">✅ Appointment is paid</div>
            ) : status === "FAILED" ? (
                <div className="text-red-500 text-xl font-semibold">❌ Appointment is not paid</div>
            ) : (
                <div className="text-gray-600 text-lg">Status unknown</div>
            )}
        </div>
    );
}

function Confirmation() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-purple-700 text-center mb-4">Appointment Confirmation</h2>
                <ConfirmationStatus />
                <div className="mt-6 flex justify-center">
                    <Link to="/bookings">
                        <Button variant="link" className="text-purple-600 hover:text-purple-800 font-semibold">
                            ← Go Back
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Confirmation;
