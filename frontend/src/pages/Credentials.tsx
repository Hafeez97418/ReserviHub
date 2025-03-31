import { Loader, Pen, Trash } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { TypographyH1, TypographyH3 } from "../components/ui/typography";
import { Card } from "../components/ui/card";
import { deleteBusiness, deleteImage, getMyBusiness, updateBusiness } from "../features/business/action";
import { useEffect, useState } from "react";
import { getFormEntries } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogDescription } from "../components/ui/dialog";
import ImageUploadForm from "../components/ImageForm";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Business } from "../lib/types";
import { setAlertMessage } from "../features/globalSlice";
import { BusinessDetailsSkeleton, CredentialsSkeleton } from "../components/Skeletons";


const BusinessInfo = ({ data }: { data: Business | null }) => {
    if (!data) return <BusinessDetailsSkeleton/>;
    const [saveBtnTxt, setSaveBtnTxt] = useState("save");
    return (
        <div className="w-full p-4 rounded-2xl shadow-lg">
            <form className="flex flex-col gap-4" onSubmit={async (e) => {
                e.preventDefault();
                setSaveBtnTxt("loading");
                const raw_data = new FormData(e.currentTarget);
                const data = getFormEntries(raw_data)
                await updateBusiness(data);
                setSaveBtnTxt("save");
            }}>
                <div className="mb-6 my-4">
                    <TypographyH3>Business details</TypographyH3>
                    <p className="text-gray-500 text-sm mt-2">
                        Update your business details.
                    </p>
                </div>

                <div className="space-y-2">
                    <Input defaultValue={data.name} name="name" required />
                    <Textarea
                        placeholder="Description of your business"
                        className="resize-none min-h-[100px]"
                        id="description"
                        name="description"
                        defaultValue={data.description}
                        required
                    />
                    <Input defaultValue={data.category} name="category" required />
                    <Input defaultValue={data.location} name="location" required />
                    <Input
                        type="number"
                        defaultValue={data.phoneNumber}
                        name="phoneNumber"
                        required
                    />
                </div>

                <Button className="mt-4 w-full py-3 text-base">{saveBtnTxt}</Button>
            </form>
        </div>
    );
};

const DeleteBtn = ({ state }: { state: "none" | "loading" | "trash" }) => {
    if (state === "none") {
        return null
    } else if (state === "loading") {
        return <Loader className="animate-spin" />
    }
    else {
        return <Trash />
    }
}
function Credentials() {
    const [data, setData] = useState<Business | null>(null);
    const [delBtnTxt, setDelBtnTxt] = useState("Delete");
    const [openImgForm, setImgForm] = useState(false);
    const [image, setImage] = useState<string>();
    const [deleteBtn, setDeleteBtn] = useState<"none" | "loading" | "trash">("none");
    const [Loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    useEffect(() => {
        setLoading(true);
        (async () => {
            const res = await getMyBusiness();
            if (res.business) {
                setData(res.business);
                setImage(res.business.image)
            }
            if (res.business.image !== null) {
                setDeleteBtn("trash")
            }
            setLoading(false);
        })();
    }, []);
    if (Loading === true) return <CredentialsSkeleton />
    return (
        <div className="p-4">
            <TypographyH1>Your Business Credentials</TypographyH1>

            <section className="flex gap-4 w-full min-w-60 flex-wrap lg:flex-nowrap my-4">
                <Card className="w-full flex-col items-center justify-around p-4">
                    <img
                        className="object-cover object-center h-60 w-full rounded-lg"
                        src={image || "/business-avatar.webp"}
                        alt="Business"
                    />
                    <div className="flex my-4 w-full justify-between">
                        <button className="cursor-pointer hover:text-green-500 focus:text-green-500" onClick={() => {
                            setImgForm(true)
                        }}>
                            <Pen />
                        </button>
                        <button className="cursor-pointer hover:text-red-500 focus:text-red-500" onClick={async () => {
                            setDeleteBtn("loading");
                            const res = await deleteImage();
                            if (res.success) {
                                setImage(undefined);
                                setAlertMessage("image has been deleted")
                                setDeleteBtn("none");
                            }
                        }}>
                            <DeleteBtn state={deleteBtn} />
                        </button>
                    </div>
                </Card>
                <BusinessInfo data={data} />
                <Dialog open={openImgForm}>
                    <DialogContent className="fixed z-40 top-0
                     left-0 w-full h-full flex flex-col items-center justify-center">
                        <DialogTitle className="hidden">Upload Image</DialogTitle>
                        <DialogDescription className="hidden">Enhance your business profile</DialogDescription>
                        <ImageUploadForm closeForm={setImgForm} setImage={setImage} setDeleteBtn={setDeleteBtn} />
                    </DialogContent>
                </Dialog>

            </section>

            <section className="my-4 flex p-4 border-2 justify-between flex-wrap md:flex-nowrap gap-4">
                <TypographyH3>Delete your business account</TypographyH3>
                <Button
                    variant="destructive"
                    onClick={async () => {
                        setDelBtnTxt("loading");
                        deleteBusiness();
                        setDelBtnTxt("deleted");
                        navigate("/login");
                    }}
                >
                    {delBtnTxt}
                </Button>
            </section>
        </div>
    );
}

export default Credentials;
