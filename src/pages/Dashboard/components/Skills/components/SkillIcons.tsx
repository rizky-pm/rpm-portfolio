import { skillSchema, type SkillFormData } from '../schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useSkillsState from '@/stores/skillsStore';
import { useEffect, useRef, useState } from 'react';
import { Pen, Plus, Trash, X } from 'lucide-react';
import EditIconDialog from './EditIconDialog';

const SkillIcons = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogProperty, setDialogProperty] = useState<{
    id: string | null;
    name: string | null;
    url: string | null;
  }>({
    id: null,
    name: null,
    url: null,
  });
  const [selectedIcon, setSelectedIcon] = useState<File | undefined>(undefined);

  const [editingSkill, setEditingSkill] = useState<string | null>(null);

  const { skills, fetchSkills, addSkill, updateSkill, deleteSkill } =
    useSkillsState();

  const inputIconRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      icon: undefined,
      name: '',
    },
  });
  const iconRef = form.register('icon');

  const onSubmit = async (values: SkillFormData) => {
    const iconList = values.icon as FileList | null;
    const icon = iconList?.[0] ?? null;

    if (!icon) {
      console.log('No icon selected');
      return;
    }

    if (editingSkill) {
      await updateSkill(editingSkill, values.name, icon as File);
      setEditingSkill(null);
    } else {
      await addSkill(values.name, icon as File);
    }
    setSelectedIcon(undefined);
    form.reset();
  };

  const onClickDeleteIcon = async (id: string) => {
    console.log(id);
    await deleteSkill(id);
  };

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return (
    <>
      <div className='space-y-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Icon name'
                      // disabled={!isEdit}
                      {...field}
                    />
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
                    <div className='flex flex-col gap-3 justify-center items-center'>
                      {selectedIcon ? (
                        <div className='flex items-center gap-3 justify-center w-48 h-48 relative border p-4 rounded-md'>
                          <img
                            src={URL.createObjectURL(selectedIcon)}
                            alt='Selected Icon'
                            className='w-full h-full'
                          />
                          <div
                            className='absolute opacity-0 hover:opacity-100 bg-foreground/20 w-full h-full rounded-md flex justify-center items-center transition-all cursor-pointer'
                            onClick={() => {
                              setSelectedIcon(undefined);
                              form.setValue('icon', undefined);
                            }}
                          >
                            <div className='bg-foreground/40 p-1 rounded'>
                              <X className='text-background w-6 h-6' />
                            </div>
                          </div>
                        </div>
                      ) : (
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
                            className='w-full border rounded p-2 hidden'
                          />

                          <div
                            className='flex justify-center items-center border-2 border-dashed rounded w-48 h-48 cursor-pointer hover:bg-foreground/10 transition-all'
                            onClick={() => {
                              if (inputIconRef.current) {
                                inputIconRef.current.click();
                              }
                            }}
                          >
                            <Plus className='text-muted-foreground' />
                          </div>
                        </>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full'>
              Add
            </Button>
          </form>
        </Form>

        <Table>
          <TableBody>
            {skills.map((skill, index) => (
              <TableRow key={skill.id}>
                <TableCell className='w-[5%]'>{index + 1}</TableCell>
                <TableCell className='w-[10%]'>
                  {skill.icon_url && (
                    <img
                      src={skill.icon_url}
                      alt={skill.name}
                      className='w-10 h-10 object-contain'
                    />
                  )}
                </TableCell>
                <TableCell className='font-medium'>{skill.name}</TableCell>
                <TableCell className='flex justify-end space-x-2'>
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      setIsDialogOpen(true);
                      setDialogProperty({
                        id: skill.id,
                        name: skill.name,
                        url: skill.icon_url,
                      });
                    }}
                  >
                    <Pen />
                  </Button>
                  <Button
                    variant={'destructive'}
                    onClick={() => {
                      onClickDeleteIcon(skill.id);
                    }}
                  >
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditIconDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        property={dialogProperty}
      />
    </>
  );
};

export default SkillIcons;
