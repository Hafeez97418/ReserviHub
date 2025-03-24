import { Link } from "react-router-dom"
import MyBookings from "../components/Bookings"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb"

const mockAppointments = [
  {
    id: "15718fce-52bd-461d-a958-bf21d8bae9da",
    userId: "d8b85eb0-506c-4026-b80d-b7ca80beb194",
    businessId: "02c68ded-b95a-4795-9544-ad82495b6228",
    intervalId: "8867d5cf-2474-4622-96b8-184d0d9deb1b",
    status: "confirmed",
    startTime: "09:00:00",
    endTime: "10:00:00",
    expiresAt: null,
    createdAt: "2025-03-23T17:57:22.000Z",
    updatedAt: "2025-03-23T18:10:00.000Z",
    Payment: {
      id: "29ed4b16-0577-45f0-8ba1-953b244a8a57",
      userId: "d8b85eb0-506c-4026-b80d-b7ca80beb194",
      appointmentId: "15718fce-52bd-461d-a958-bf21d8bae9da",
      amount: "200.00",
      status: "pending",
      order: {
        success: true,
        response: {
          customer_details: {
            customer_id: "d8b85eb0-506c-4026-b80d-b7ca80beb194",
            customer_name: "Hafeez",
            customer_email: "muhammed.hafeez.nayazi@gmail.com",
            customer_phone: "9741893288"
          }
        }
      },
      createdAt: "2025-03-23T17:57:23.000Z",
      updatedAt: "2025-03-23T17:57:23.000Z"
    }
  }
]

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
  return (
    <div>
      <BreadCrumbs pageName="bookings" />
      <div className="my-8">
        <MyBookings appointments={mockAppointments} />
      </div>
    </div>
  )
}

export default Bookings
