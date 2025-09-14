import React from "react";

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
      <div className="space-y-1">
        <button
          onClick={() => onPhoneCall(primaryPhone)}
          className="text-primary hover:text-primary underline block cursor-pointer"
        >
          {primaryPhone}
        </button>
        {alternatePhone && (
          <div className="text-sm text-gray-500">
            Alt:{" "}
            <button
              onClick={() => onPhoneCall(alternatePhone)}
              className="text-primary hover:text-primary underline cursor-pointer"
            >
              {alternatePhone}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <span className="font-medium">Phone:</span>{" "}
      <button
        onClick={() => onPhoneCall(primaryPhone)}
        className="text-primary hover:text-primary underline break-all"
      >
        {primaryPhone}
      </button>
      {alternatePhone && (
        <div className="text-gray-500 text-xs mt-1">
          <span className="font-medium">Alt:</span>{" "}
          <button
            onClick={() => onPhoneCall(alternatePhone)}
            className="text-primary hover:text-primary underline break-all"
          >
            {alternatePhone}
          </button>
        </div>
      )}
    </div>
  );
};