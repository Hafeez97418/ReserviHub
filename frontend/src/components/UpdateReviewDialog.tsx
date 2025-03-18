import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Star } from "lucide-react";

interface Review {
    id: string;
    userId: string;
    businessId: string;
    rating: number;
    review: string;
    createdAt: string;
    updatedAt: string;
}

interface UpdateDialogProps {
    review: Review;
    onClose: () => void;
    onUpdate: (updatedReview: Review) => void;
}

export default function UpdateReviewDialog({ review, onClose, onUpdate }: UpdateDialogProps) {
    const [rating, setRating] = useState(review.rating);
    const [text, setText] = useState(review.review);

    const handleUpdate = () => {
        const updated = { ...review, rating, review: text, updatedAt: new Date().toISOString() };
        onUpdate(updated);
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>Update Your Review</DialogHeader>
                <div className="space-y-4">
                    <div className="flex space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                            <Star
                                key={i}
                                className={`h-6 w-6 cursor-pointer ${i < rating ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-400"}`}
                                onClick={() => setRating(i + 1)}
                            />
                        ))}
                    </div>
                    <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write your review"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleUpdate}>Update</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
