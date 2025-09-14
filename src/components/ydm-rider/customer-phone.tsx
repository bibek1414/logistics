import React from "react";
import { Button } from "@/components/ui/button"; 

interface CustomerPhoneProps {
  primaryPhone: string;
  alternatePhone?: string | null;
  onPhoneCall: (phoneNumber: string) => void;
  isDesktop?: boolean;
}

export const CustomerPhone: React.FC<CustomerPhoneProps> = ({
  primaryPhone,
  alternatePhone,
  onPhoneCall,
  isDesktop = false,
}) => {
  if (isDesktop) {
    return (
      <div className="space-y-1 text-left">
        <Button
          variant="link"
          onClick={() => onPhoneCall(primaryPhone)}
          className="text-primary p-0 h-auto font-normal"
        >
          {primaryPhone}
        </Button>

        {alternatePhone && (
          <div className="text-sm text-gray-500 text-left">
            Alt:{" "}
            <Button
              variant="link"
              onClick={() => onPhoneCall(alternatePhone)}
              className="text-primary p-0 h-auto font-normal"
            >
              {alternatePhone}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-left">
      <span className="font-medium">Phone:</span>{" "}
      <Button
        variant="link"
        onClick={() => onPhoneCall(primaryPhone)}
        className="text-primary p-0 h-auto font-normal break-all"
      >
        {primaryPhone}
      </Button>

      {alternatePhone && (
        <div className="text-gray-500 text-xs mt-1 text-left">
          <span className="font-medium">Alt:</span>{" "}
          <Button
            variant="link"
            onClick={() => onPhoneCall(alternatePhone)}
            className="text-primary p-0 h-auto font-normal break-all"
          >
            {alternatePhone}
          </Button>
        </div>
      )}
    </div>
  );
};
