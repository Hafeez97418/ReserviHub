import { useEffect, useState } from 'react';
import LeadsComponent from '../components/Leads';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../components/ui/breadcrumb'
import { Link, useParams } from 'react-router-dom'
import { getCustomers } from '../features/business/action';
import { LeadsComponentSkeleton } from '../components/Skeletons';

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


function Leads() {
    const { intervalId
    } = useParams();
    const [Loading, setLoading] = useState<boolean>();
    const [appointments, setAppointments] = useState([]);
    useEffect(() => {
        setLoading(true);
        (async () => {
            const res = await getCustomers(intervalId);
            setAppointments(res.result);
            setLoading(false);
        })();
    }, [])
    return (
        <div className='m-4'>
            <BreadCrumbs pageName='Leads'></BreadCrumbs>
            <div className='my-4'>
                {
                    Loading !== false ? <LeadsComponentSkeleton />
                        :
                        <LeadsComponent leads={appointments} />}
            </div>
        </div>
    )
}

export default Leads
