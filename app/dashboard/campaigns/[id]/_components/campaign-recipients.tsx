'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

interface CampaignRecipientsProps {
  campaignId: string;
  recipients: Array<{
    id: string;
    status: string;
    sent_at: string | null;
    contacts: {
      email: string;
      name: string | null;
    } | null;
  }>;
}

export function CampaignRecipients({ campaignId, recipients }: CampaignRecipientsProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Recipient</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sent At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipients.map((recipient) => (
            <TableRow key={recipient.id}>
              <TableCell>
                <div>
                  {recipient.contacts?.name && (
                    <div className="font-medium">{recipient.contacts.name}</div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {recipient.contacts?.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={recipient.status === 'delivered' ? 'default' : 'secondary'}>
                  {recipient.status}
                </Badge>
              </TableCell>
              <TableCell>
                {recipient.sent_at ? (
                  format(new Date(recipient.sent_at), 'PPp')
                ) : (
                  '-'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 