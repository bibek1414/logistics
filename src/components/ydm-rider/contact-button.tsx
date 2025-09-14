

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Phone, ChevronDown } from "lucide-react";

interface ContactInfo {
  phone_number: string;
  first_name: string;
  last_name: string;
}

interface ContactButtonProps {
  contacts: ContactInfo[];
  buttonText: string;
  className?: string;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  contacts,
  buttonText,
  className = "",
}) => {
  const handlePhoneCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  // If only one contact, render simple button
  if (contacts.length === 1) {
    return (
      <Button
        size="sm"
        variant="outline"
        className={`flex-1 text-xs px-2 py-1.5 h-8 justify-start ${className} w-fit`}
        onClick={() => handlePhoneCall(contacts[0].phone_number)}
      >
        <Phone className="h-3 w-3 mr-1" />
        <span className="truncate">
          {buttonText} {contacts[0].first_name} {contacts[0].last_name}
        </span>
      </Button>
    );
  }

  // If multiple contacts, render dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={`flex-1 text-xs px-2 py-1.5 h-8 justify-start ${className} w-fit`}
        >
          <Phone className="h-3 w-3 mr-1" />
          <span className="truncate">{buttonText}</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {contacts.map((contact, index) => (
          <DropdownMenuItem
            key={`${contact.phone_number}-${index}`}
            onClick={() => handlePhoneCall(contact.phone_number)}
            className="flex items-center gap-2 cursor-pointer justify-start"
          >
            <Phone className="h-3 w-3" />
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium">
                {contact.first_name} {contact.last_name}
              </span>
              <span className="text-xs text-gray-500">{contact.phone_number}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};