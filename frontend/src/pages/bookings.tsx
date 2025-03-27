import { Link } from "react-router-dom"
import MyBookings from "../components/Bookings"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb"
import { useEffect, useState } from "react"
import { getAllAppointments } from "../features/appointments/action"
import { Appointment } from "../lib/types"

function BreadCrumbs({ pageName }: { pageName: string }) {
  return <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <Link to="/">Home</Link>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>{pageName}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>

}
function Bookings() {
  const [appointments, setAppointments] = useState<Appointment[]>();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const data = await getAllAppointments();
      if (data.success) {
        setAppointments(data.appointments);

      }
      setLoading(false);
    })();
  }, [])
  return (
    <div>
      <BreadCrumbs pageName="bookings" />
      <div className="my-8">
        {isLoading ? "Loading..." :
          
          <MyBookings appointments={appointments} />}
      </div>
    </div>
  )
}

export default Bookings
