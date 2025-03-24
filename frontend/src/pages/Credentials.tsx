import { Pen, Trash} from 'lucide-react';
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea'
import { TypographyH1, TypographyH3 } from '../components/ui/typography'
import { Card } from '../components/ui/card';

const data = {
    "name": "ReserviHub",
    "description": "an online reservation platform",
    "category": "tech",
    "location": "banglore, karnataka",
    "phoneNumber": "9741893288",
    image: null,
};
const BusinessInfo = () => {
    return <div className="w-full p-4 rounded-2xl shadow-lg">
        <form className="flex flex-col gap-4">
            <div className="mb-6 my-4">
                <TypographyH3>Business details</TypographyH3>
                <p className="text-gray-500 text-sm mt-2">update your business details.</p>
            </div>

            <div className="space-y-2">
                <Input defaultValue={data.name} name="name" />
                <Textarea
                    placeholder="Description of your business"
                    className="resize-none min-h-[100px]"
                    id="description"
                    name="description"
                    defaultValue={data.description}
                />
                <Input defaultValue={data.category} name="category" />
                <Input defaultValue={data.location} name='location' />
                <Input type='number' defaultValue={data.phoneNumber} name='phoneNumber' />
            </div>

            <Button className="mt-4 w-full py-3 text-base">save</Button>
        </form>
    </div>
}
function Credentials() {

    return (
        <div className='p-4'>
            <TypographyH1>Your Business Credentials</TypographyH1>
            <section className="flex gap-4 w-full min-w-60 flex-wrap lg:flex-nowrap my-4  ">
                <Card className="w-full flex-col items-center justify-between p-4">
                    <img className='object-cover object-center h-full ' src={data.image || "/business-avatar.webp"} ></img>
                    <div className="flex my-4 w-full justify-between">
                        <button className='cursor-pointer hover:text-green-500 focus:text-green-500' onClick={() => {
                            
                        }}>
                            <Pen />
                        </button>
                        <button className='cursor-pointer hover:text-red-500 focus:text-red-500' >
                            <Trash />
                        </button>
                    </div>
                </Card>
                <BusinessInfo />
            </section>
            <section className='my-4 flex p-4 border-2 justify-between flex-wrap md:flex-nowrap gap-4'>
                <TypographyH3>delete your business account</TypographyH3>
                <Button variant={"destructive"} onClick={() => {
                    alert("account deleted")
                }}>delete</Button>
            </section>
        </div>
    )
}

export default Credentials
