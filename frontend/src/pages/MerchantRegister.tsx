import { TypographyH1 } from "../components/ui/typography";
import { Textarea } from "../components/ui/textarea";
import { LabelInput } from "../components/Inputs";
import { Button } from "../components/ui/button";

function MerchantRegister() {
    return (
        <div className="max-w-2xl mx-auto p-8 rounded-2xl shadow-lg">
            <form className="flex flex-col gap-6">
                <div className="mb-6 text-center">
                    <TypographyH1>Create a Business Account</TypographyH1>
                    <p className="text-gray-500 text-sm mt-2">Fill in the details below to register your business.</p>
                </div>

                <div className="space-y-4">
                    <LabelInput
                        placeHolder="ex: reservihub"
                        id="name"
                        labelText="Business Name"
                    />

                    <div>
                        <label htmlFor="description" className="block mb-1 text-sm font-semibold text-gray-700">Business Description</label>
                        <Textarea
                            placeholder="Description of your business"
                            className="resize-none min-h-[100px]"
                            id="description"
                            name="description"
                        />
                    </div>

                    <LabelInput
                        placeHolder="ex: Bangalore, Karnataka"
                        id="location"
                        labelText="Business Location"
                    />

                    <LabelInput
                        placeHolder="Construction, Health Care"
                        id="category"
                        labelText="Business Category"
                    />

                    <LabelInput
                        placeHolder="XXXXXXXXXXX"
                        id="phoneNumber"
                        labelText="Phone Number"
                        type="tel"
                    />
                </div>

                <Button className="mt-4 w-full py-3 text-base">Register Business</Button>
            </form>
        </div>
    );
}

export default MerchantRegister;
