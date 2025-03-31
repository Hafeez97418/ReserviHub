import { useEffect, useState } from 'react'
import DashboardStats from '../components/DashboardStats'
import { TypographyH1 } from '../components/ui/typography'
import { getAdvice, getAnalytics } from '../features/business/action';
import { DashboardStatsSkeleton } from '../components/Skeletons';

function Analytics() {

  const [analytics, setAnalytics] = useState();
  const [advice, setAdvice] = useState<string>();
  useEffect(() => {
    (async () => {
      const res = await getAnalytics()
      if (res.success) {
        setAnalytics(res.analytics)
        const id = res.analytics.businessId;
        if (!id) {
          return
        }
        const advice = sessionStorage.getItem(`adviceFor${id}`);
        if (advice) {
          setAdvice(advice.replace(/"|\\n/g, ''))
          return
        }
        const data = await getAdvice(id);
        if (data.result) {
          data.result.replace(/"|\\n/g, '');
          sessionStorage.setItem(`adviceFor${id}`, JSON.stringify(data.result));
          setAdvice(data.result);
        }
      }
    })()
  }, [])

  return (
    <div className='p-4'>
      <TypographyH1>Business Analytics</TypographyH1>
      {analytics ? <DashboardStats analytics={analytics} advice={advice} /> : <DashboardStatsSkeleton />}
    </div>
  )
}

export default Analytics
