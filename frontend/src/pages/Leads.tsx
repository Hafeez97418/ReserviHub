import LeadsComponent from '../components/Leads';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../components/ui/breadcrumb'
import { Link } from 'react-router-dom'

function BreadCrumbs({ pageName }: { pageName: string }) {
    return <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
                <Link to="/merchant">merchant</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <Link to="/merchant/slots">Slots</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbPage>{pageName}</BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>

}

const mockAppointments = [
    {
        id: "15718fce-52bd-461d-a958-bf21d8bae9da",
        userId: "d8b85eb0-506c-4026-b80d-b7ca80beb194",
        businessId: "02c68ded-b95a-4795-9544-ad82495b6228",
        intervalId: "8867d5cf-2474-4622-96b8-184d0d9deb1b",
        status: "failed",
        startTime: "09:00:00",
        endTime: "10:00:00",
        expiresAt: null,
        createdAt: "2025-03-23T17:57:22.000Z",
        updatedAt: "2025-03-23T18:10:00.000Z",
        User: {
            id: "d8b85eb0-506c-4026-b80d-b7ca80beb194",
            name: "Hafeez",
            email: "muhammed.hafeez.nayazi@gmail.com",
            phoneNumber: "9741893288"
        },
        Payment: {
            id: "29ed4b16-0577-45f0-8ba1-953b244a8a57",
            status: "pending",
            amount: "200.00"
        }
    },
    {
        id: "2b91e4c0-76ab-4b1c-8f0e-5b1eab3d7e77",
        userId: "f2d1c1b3-b987-4c0e-9255-1d49cb0e2c8e",
        businessId: "02c68ded-b95a-4795-9544-ad82495b6228",
        intervalId: "3fa9e441-544b-4f9e-ba4b-d125e8ffb80d",
        status: "confirmed",
        startTime: "13:00:00",
        endTime: "14:00:00",
        expiresAt: null,
        createdAt: "2025-03-24T15:41:49.000Z",
        updatedAt: "2025-03-24T16:00:00.000Z",
        User: {
            id: "f2d1c1b3-b987-4c0e-9255-1d49cb0e2c8e",
            name: "hafeez",
            email: "hafeez@example.com",
            phoneNumber: "9812345678"
        },
        Payment: {
            id: "45bf31d4-758d-4f20-9385-98a94b9b39d8",
            status: "completed",
            amount: "250.00"
        }
    }
];


function Leads() {
    return (
        <div className='m-4'>
            <BreadCrumbs pageName='Leads'></BreadCrumbs>
            <div className='my-4'>
                <LeadsComponent leads={mockAppointments} />
            </div>
        </div>
    )
}

export default Leads
