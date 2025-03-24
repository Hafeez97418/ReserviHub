import { useEffect, useState } from "react";
import { TypographyH3 } from "./ui/typography";
import { createMyReview, deleteMyReview, getMyReview, updateMyReview } from "../features/reviews/action";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

// Types
interface Review {
    id?: string;
    userId: string;
    rating: number;
    review: string;
}

interface ReviewsProps {
    businessId: string;
}

function Reviews({ businessId }: ReviewsProps) {
    const [myReview, setMyReview] = useState<Review | undefined>(undefined);
    const [dialogMode, setDialogMode] = useState<"create" | "update" | null>(null);
    const [deleteBtnText, setDeleteBtnText] = useState("Delete");
    const [allReviews, setAllReviews] = useState<Review[]>([]);

    useEffect(() => {
        (async () => {
            const my_review = await getMyReview(businessId, false) as Review[];
            let all_reviews = await getMyReview(businessId, true) as Review[];
            if (my_review.length > 0) {
                all_reviews = all_reviews.filter(r => r.userId !== my_review[0].userId);
                setMyReview(my_review[0]);
            }
            setAllReviews(all_reviews);
        })();
    }, [businessId]);

    return (
        <div>
            <TypographyH3>Reviews</TypographyH3>

            {myReview ? (
                <div className="flex justify-between w-full items-center border-2 px-4 py-2 my-2 gap-4">
                    <div className="flex flex-col gap-2 w-full">
                        <h4>Your Review</h4>
                        <ReviewStars rating={myReview.rating} interactive={false} />
                        <p className="text-sm">{myReview.review}</p>
                    </div>
                    <Button onClick={() => setDialogMode("update")}>Edit</Button>
                    <Button
                        onClick={async () => {
                            setDeleteBtnText("Loading");
                            const res = await deleteMyReview(businessId);
                            if (res.success) {
                                setMyReview(undefined);
                            }
                            setDeleteBtnText(res.success ? "Delete" : "Failed");
                        }}
                    >
                        {deleteBtnText}
                    </Button>
                </div>
            ) : (
                <Button className="my-4" onClick={() => setDialogMode("create")}>Post a Review</Button>
            )}

            <div className="my-4">
                {allReviews.length > 0 &&
                    allReviews.map(r => (
                        <div className="flex flex-col w-full py-2 gap-2 border-b-2" key={r.id}>
                            <div className="text-lg font-semibold">User: {r.userId.slice(0, 2)}</div>
                            <ReviewStars rating={r.rating} interactive={false} />
                            <p className="text-sm">{r.review}</p>
                        </div>
                    ))
                }
            </div>

            {dialogMode && (
                <ReviewDialog
                    mode={dialogMode}
                    onClose={() => setDialogMode(null)}
                    businessId={businessId}
                    review={myReview}
                    setMyReview={setMyReview}
                />
            )}
        </div>
    );
}

function ReviewStars({ rating, interactive, onRate }: { rating: number; interactive: boolean; onRate?: (rating: number) => void }) {
    return (
        <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    className="h-4 w-4 cursor-pointer"
                    fill={i <= rating ? "oklch(0.627 0.265 303.9" : "none"}
                    onClick={interactive && onRate ? () => onRate(i) : undefined}
                />
            ))}
        </div>
    );
}

function ReviewDialog({
    mode,
    onClose,
    businessId,
    review,
    setMyReview
}: {
    mode: "create" | "update";
    onClose: () => void;
    businessId: string;
    review?: Review;
    setMyReview: (review: Review) => void;
}) {
    const [form, setForm] = useState<Review>(review || { userId: "", rating: 0, review: "" });

    const handleSave = async () => {
        if (mode === "create") {
            const data = await createMyReview(businessId, form);
            if (data.success) {
                setMyReview(form);
                onClose();
            }
        } else if (mode === "update") {
            await updateMyReview(businessId, form);
            setMyReview(form);
            onClose();
        }
    };

    return (
        <Dialog open={true}>
            <DialogContent className="fixed z-20 top-0 left-0 w-full h-full flex items-center justify-center">
                <Card className="gap-4 p-8 border-2 rounded-xl">
                    <DialogHeader>
                        <DialogTitle>{mode === "create" ? "Share Your Experience" : "Update Your Experience"}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <ReviewStars
                            rating={form.rating}
                            interactive={true}
                            onRate={(rating: number) => setForm({ ...form, rating })}
                        />
                        <Input
                            placeholder="Enter your review"
                            value={form.review}
                            onChange={(e) => setForm({ ...form, review: e.target.value })}
                        />
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <Button type="button" variant="secondary" onClick={handleSave}>
                            Save
                        </Button>
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </Card>
            </DialogContent>
        </Dialog>
    );
}

export default Reviews;
