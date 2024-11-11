'use client';

import { useState, useCallback } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Progress } from '@/components/ui/progress';

interface Contact {
  email: string;
  name: string | null;
  error?: string;
}

interface CSVRow {
  email?: string;
  Email?: string;
  name?: string;
  Name?: string;
  [key: string]: string | undefined;
}

export function ImportContactsDialog() {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      Papa.parse<CSVRow>(file, {
        header: true,
        complete: (results) => {
          const parsedContacts = results.data
            .map((row) => ({
              email: row.email || row.Email || '',
              name: row.name || row.Name || null,
            }))
            .filter((row): row is { email: string; name: string | null } => 
              Boolean(row.email)
            );

          // Basic validation
          const validatedContacts: Contact[] = parsedContacts.map(contact => ({
            ...contact,
            error: !contact.email.includes('@') ? 'Invalid email' : undefined
          }));

          setContacts(validatedContacts);
        },
        error: (error: { message: string }) => {
          toast({
            title: 'Error parsing CSV',
            description: error.message,
            variant: 'destructive',
          });
        }
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
  });

  const handleImport = async () => {
    const validContacts = contacts.filter(c => !c.error);
    if (!validContacts.length) return;

    setImporting(true);
    let imported = 0;

    try {
      // Import contacts in batches of 50
      const batchSize = 50;
      for (let i = 0; i < validContacts.length; i += batchSize) {
        const batch = validContacts.slice(i, i + batchSize);
        
        const response = await fetch('/api/contacts/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contacts: batch }),
        });

        if (!response.ok) throw new Error('Failed to import contacts');
        
        imported += batch.length;
        setProgress((imported / validContacts.length) * 100);
      }

      toast({
        title: 'Contacts imported',
        description: `Successfully imported ${imported} contacts.`,
      });
      
      setOpen(false);
      router.refresh();
    } catch {
      toast({
        title: 'Import failed',
        description: 'Failed to import contacts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Import Contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
          <DialogDescription>
            Upload a CSV file with your contacts. The file should include email and name columns.
          </DialogDescription>
        </DialogHeader>

        {!contacts.length ? (
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors
              ${isDragActive ? 'border-primary' : 'border-muted-foreground/25'}
            `}
          >
            <input {...getInputProps()} />
            <FileSpreadsheet className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? 'Drop your CSV file here'
                : 'Drag & drop your CSV file here, or click to select'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg divide-y">
              {contacts.slice(0, 5).map((contact, i) => (
                <div
                  key={i}
                  className="p-2 flex items-center justify-between text-sm"
                >
                  <div className="flex-1">
                    <div>{contact.email}</div>
                    {contact.name && (
                      <div className="text-muted-foreground">{contact.name}</div>
                    )}
                  </div>
                  {contact.error && (
                    <div className="flex items-center text-destructive">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {contact.error}
                    </div>
                  )}
                </div>
              ))}
              {contacts.length > 5 && (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  And {contacts.length - 5} more contacts...
                </div>
              )}
            </div>

            {importing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground text-center">
                  Importing contacts... {Math.round(progress)}%
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setContacts([]);
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!contacts.length || importing}
          >
            {importing ? 'Importing...' : `Import ${contacts.length} Contacts`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 