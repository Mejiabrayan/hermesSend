'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Search, Loader2 } from 'lucide-react';
import { Tables } from '@/utils/database.types';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface RecipientSelectorProps {
  selectedRecipients: string[];
  onRecipientsChangeAction: (recipients: string[]) => void;
}

export function RecipientSelector({ 
  selectedRecipients, 
  onRecipientsChangeAction 
}: RecipientSelectorProps) {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<Tables<'contacts'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenChange = async (open: boolean) => {
    setOpen(open);
    if (open && contacts.length === 0) {
      setLoading(true);
      try {
        const response = await fetch('/api/contacts');
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setContacts(data.contacts || []);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchQuery.toLowerCase();
    return (
      contact.email.toLowerCase().includes(searchLower) ||
      (contact.name?.toLowerCase() || '').includes(searchLower)
    );
  });

  const toggleRecipient = (contactId: string) => {
    const newRecipients = selectedRecipients.includes(contactId)
      ? selectedRecipients.filter(id => id !== contactId)
      : [...selectedRecipients, contactId];
    onRecipientsChangeAction(newRecipients);
  };

  const toggleAll = () => {
    if (selectedRecipients.length === filteredContacts.length) {
      onRecipientsChangeAction  ([]);
    } else {
      onRecipientsChangeAction(filteredContacts.map(contact => contact.id));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "w-full justify-between",
            selectedRecipients.length > 0 && "border-primary"
          )}
        >
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Recipients
          </div>
          {selectedRecipients.length > 0 && (
            <Badge variant="secondary">
              {selectedRecipients.length} selected
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Recipients</DialogTitle>
          <DialogDescription>
            Choose who will receive this campaign.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAll}
              disabled={loading || contacts.length === 0}
            >
              {selectedRecipients.length === filteredContacts.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
          <ScrollArea className="h-[300px] pr-4">
            {loading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading contacts...
              </div>
            ) : contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Users className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No contacts found. Add some contacts first.
                </p>
                <Button 
                  variant="link" 
                  asChild 
                  className="mt-2"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/dashboard/contacts">
                    Add Contacts
                  </Link>
                </Button>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-sm text-muted-foreground">
                  No contacts match your search.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer"
                    onClick={() => toggleRecipient(contact.id)}
                  >
                    <Checkbox
                      id={contact.id}
                      checked={selectedRecipients.includes(contact.id)}
                      onCheckedChange={() => toggleRecipient(contact.id)}
                    />
                    <label
                      htmlFor={contact.id}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      <div className="font-medium">{contact.email}</div>
                      {contact.name && (
                        <div className="text-muted-foreground text-xs">
                          {contact.name}
                        </div>
                      )}
                    </label>
                    {contact.status !== 'active' && (
                      <Badge 
                        variant={contact.status === 'bounced' ? 'destructive' : 'secondary'}
                        className="ml-2"
                      >
                        {contact.status}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
        <DialogFooter className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedRecipients.length} recipients selected
          </p>
          <Button onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 