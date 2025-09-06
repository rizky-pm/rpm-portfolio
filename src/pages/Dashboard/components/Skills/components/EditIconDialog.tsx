import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { skillSchema, type SkillFormData } from '../schema';
import useSkillsState from '@/stores/skillsStore';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IEditIconDialog {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  property: {
    id: string | null;
    name: string | null;
    url: string | null;
  };
}

const EditIconDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  property,
}: IEditIconDialog) => {
  const [selectedIcon, setSelectedIcon] = useState<File | undefined>(undefined);
  const inputIconRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: property.name || '',
      icon: undefined,
    },
  });

  const iconRef = form.register('icon');

  useEffect(() => {
    form.reset({
      name: property.name || '',
      icon: undefined,
    });
    setSelectedIcon(undefined);
  }, [property, form]);

  const handleUpdate = async (values: SkillFormData) => {
    if (!property.id) return;

    const icon = values.icon instanceof File ? values.icon : selectedIcon;

    await useSkillsState
      .getState()
      .updateSkill(property.id, values.name, icon as File);

    setIsDialogOpen(false);
    setSelectedIcon(undefined);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Edit Skill Icon</DialogTitle>
          <DialogDescription>
            Update the skill name or replace the icon.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className='space-y-6'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter skill name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='icon'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <div className='flex flex-col items-center gap-3'>
                      <div className='flex items-center gap-3 justify-center w-48 h-48 relative border p-4 rounded-md'>
                        <img
                          src={
                            selectedIcon
                              ? URL.createObjectURL(selectedIcon)
                              : property.url || ''
                          }
                          alt='Selected Icon'
                          className='w-full h-full'
                        />
                        <div
                          className='absolute opacity-0 hover:opacity-100 bg-foreground/20 w-full h-full rounded-md flex justify-center items-center transition-all cursor-pointer'
                          onClick={() => {
                            setSelectedIcon(undefined);
                            form.setValue('icon', undefined);
                            if (inputIconRef.current) {
                              inputIconRef.current.value = '';
                              inputIconRef.current?.click();
                            }
                          }}
                        >
                          <div className='bg-foreground/40 p-1 rounded'>
                            <X className='text-background w-6 h-6' />
                          </div>
                        </div>
                      </div>

                      <>
                        <Input
                          type='file'
                          accept='image/png,image/jpeg,image/webp,image/svg+xml'
                          {...iconRef}
                          ref={(e) => {
                            field.ref(e);
                            inputIconRef.current = e;
                          }}
                          onChange={(event) => {
                            setSelectedIcon(
                              event.target.files?.[0] ?? undefined
                            );
                            field.onChange(event.target.files ?? undefined);
                          }}
                          className='hidden'
                        />

                        <div
                          className='justify-center items-center border-2 border-dashed rounded w-48 h-48 cursor-pointer hover:bg-foreground/10 transition-all hidden'
                          onClick={() => inputIconRef.current?.click()}
                        >
                          <Plus className='text-muted-foreground' />
                        </div>
                      </>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setIsDialogOpen(false)}
                type='button'
              >
                Cancel
              </Button>
              <Button type='submit'>Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditIconDialog;
