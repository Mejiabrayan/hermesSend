import { createServer } from '@/utils/supabase/server';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

import { AddContactDialog } from './_components/add-contact-dialog';

export default async function ContactsPage() {
  const supabase = await createServer();
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-sm text-muted-foreground">
            Manage your email contacts and lists
          </p>
        </div>
        <AddContactDialog />
      </div>

      <DataTable columns={columns} data={contacts || []} />
    </div>
  );
} 