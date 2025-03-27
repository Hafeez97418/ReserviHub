import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { UploadCloud } from "lucide-react";
import { uploadImage } from "../features/business/action";
import { useDispatch } from "react-redux";
import { setAlertMessage } from "../features/globalSlice";

interface ImageUploadFormProps {
    closeForm: (value: boolean) => void;
    setImage: Function,
    setDeleteBtn: Function
}

export default function ImageUploadForm({ closeForm, setImage, setDeleteBtn }: ImageUploadFormProps) {
    const dispatch = useDispatch();
    const [file, setFile] = useState<File | null>(null);
    const [saveBtnTxt, setSaveBtnTxt] = useState("Upload");

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaveBtnTxt("loading...");
        if (!file) {
            dispatch(setAlertMessage("No file selected"));
            return;
        }

        const data = new FormData();
        data.append("avatar", file);
        try {
            const res = await uploadImage(data);
            if (res?.success) {
                dispatch(setAlertMessage("Image uploaded successfully"));
                setSaveBtnTxt("saved");
                setDeleteBtn("trash")
                closeForm(false);
            } else {
                dispatch(setAlertMessage("Image upload failed"));
                setSaveBtnTxt("try again")
            }
        } catch (error) {
            dispatch(setAlertMessage("Error uploading image"));
            setSaveBtnTxt("try again")
        }
    };

    return (
        <Card className="max-w-sm mx-auto p-4 space-y-4">
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Label htmlFor="image-upload" className="block text-sm font-medium">
                        Upload Image
                    </Label>
                    <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        name="avatar"
                        required
                    />
                    <Button type="submit" className="w-full flex items-center gap-2">
                        <UploadCloud className="w-5 h-5" /> {saveBtnTxt}
                    </Button>
                    <button
                        type="button"
                        onClick={() => closeForm(false)}
                        className="w-full text-gray-600 mt-2"
                    >
                        Cancel
                    </button>
                </form>
            </CardContent>
        </Card>
    );
}
