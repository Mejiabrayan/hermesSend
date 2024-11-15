'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tables } from '@/utils/database.types';

interface TopContactsProps {
  contacts: Tables<'contacts'>[];
}

export function TopContacts({ contacts }: TopContactsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  {contact.name?.[0] || contact.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{contact.name || 'No name'}</div>
                <div className="text-sm text-muted-foreground">
                  {contact.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 