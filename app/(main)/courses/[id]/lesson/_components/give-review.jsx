'use client'
import React, { useState } from "react";
import { ReviewModal } from "./review-modal";
import { Button } from "@/components/ui/button";

const GiveReview = () => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setIsReviewModalOpen(true)}
        variant="outline"
        className="w-full mt-6"
      >
        Give Review
      </Button>

      <ReviewModal open={isReviewModalOpen} setOpen={setIsReviewModalOpen} />
    </>
  );
};

export default GiveReview;
