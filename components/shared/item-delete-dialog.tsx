'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { deleteItemAction } from '@/lib/actions/dashboard/delete-item-action';

const ItemDeleteDialog = ({
  itemId,
  itemName,
  open,
  onOpenChange,
  onDeleted,
}: {
  itemId: string;
  itemName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteItemAction(itemId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onOpenChange(false);
      onDeleted();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Delete item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{itemName}&quot;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isPending}
            className='min-w-24'
          >
            {isPending ? <Spinner /> : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDeleteDialog;