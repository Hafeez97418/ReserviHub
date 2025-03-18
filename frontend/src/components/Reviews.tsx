import { Card, CardContent } from "./ui/card";
import { Star, Trash2, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { TypographyH3 } from "./ui/typography";
import UpdateReviewDialog from "./UpdateReviewDialog";
import { Button } from "./ui/button";

export interface Review {
    id: string;
    userId: string;
    businessId: string;
    rating: number;
    review: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewsProps {
    reviews: Review[];
    currentUserId: string;
    onDelete: (id: string) => void;
    onUpdate: (updatedReview: Review) => void;
}

export default function ReviewsComponent({ reviews, currentUserId, onDelete, onUpdate }: ReviewsProps) {
    const [userReview, setUserReview] = useState<Review | null>(null);
    const [otherReviews, setOtherReviews] = useState<Review[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showDialog, setShowDialog] = useState(false);

    const reviewsPerPage = 3;

    useEffect(() => {
        const userRev = reviews.find(r => r.userId === currentUserId);
        const others = reviews.filter(r => r.userId !== currentUserId);
        setUserReview(userRev || null);
        setOtherReviews(others);
    }, [reviews, currentUserId]);

    const renderStars = (rating: number) => {
        return Array.from({ length: rating }, (_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
        ));
    };

    const handleDelete = () => {
        if (userReview) {
            onDelete(userReview.id);
        }
    };

    const handlePageChange = (direction: "next" | "prev") => {
        if (direction === "next" && currentPage * reviewsPerPage < otherReviews.length) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const paginatedReviews = otherReviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage);

    return (
        <div className="space-y-4">
            <TypographyH3>Customer reviews</TypographyH3>

            {userReview && (
                <Card className="border-2 border-purple-600 shadow-md">
                    <CardContent className="px-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">Your Review</span>
                            <div className="flex">{renderStars(userReview.rating)}</div>
                        </div>
                        <p className="text-muted-foreground">{userReview.review}</p>
                        <p className="text-xs text-right text-gray-400">{new Date(userReview.createdAt).toLocaleString()}</p>
                        <div className="flex space-x-2 justify-end">
                            <Pencil className="h-4 w-4 cursor-pointer text-blue-500" onClick={() => setShowDialog(true)} />
                            <Trash2 className="h-4 w-4 cursor-pointer text-red-500" onClick={handleDelete} />
                        </div>
                    </CardContent>
                </Card>
            )}

            {paginatedReviews.map((review) => (
                <Card key={review.id} className="shadow-sm gap-0">
                    <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">User: {review.userId.slice(0, 6)}...</span>
                            <div className="flex">{renderStars(review.rating)}</div>
                        </div>
                        <p className="text-muted-foreground">{review.review}</p>
                        <p className="text-xs text-right text-gray-400">{new Date(review.createdAt).toLocaleString()}</p>
                    </CardContent>
                </Card>
            ))}

            {/* Pagination Controls */}
            <div className="flex justify-between pt-4">
                <Button variant={"outline"} disabled={currentPage === 1} onClick={() => handlePageChange("prev")} className="text-sm text-blue-600 disabled:opacity-50">Previous</Button>
                <Button variant={"outline"} disabled={currentPage * reviewsPerPage >= otherReviews.length} onClick={() => handlePageChange("next")} className="text-sm text-blue-600 disabled:opacity-50">Next</Button>
            </div>

            {showDialog && userReview && (
                <UpdateReviewDialog
                    review={userReview}
                    onClose={() => setShowDialog(false)}
                    onUpdate={onUpdate}
                />
            )}
        </div>
    );
}

