
import Dashboard from "@/components/Dashboard";
import DailyReview from "@/components/DailyReview";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Index = () => {
  const [showReview, setShowReview] = useState(false);
  
  return (
    <div>
      {!showReview ? (
        <>
          <Dashboard />
          <div className="mt-6 text-center">
            <Button 
              onClick={() => setShowReview(true)}
              variant="outline"
              className="mx-auto"
            >
              Start daily review
            </Button>
          </div>
        </>
      ) : (
        <DailyReview onComplete={() => setShowReview(false)} />
      )}
    </div>
  );
};

export default Index;
