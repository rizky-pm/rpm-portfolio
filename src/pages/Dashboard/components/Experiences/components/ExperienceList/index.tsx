import { TypographyH3, TypographyH4 } from '@/components/ui/typography';
import { useForm } from 'react-hook-form';
import {
  experienceListFormSchema,
  type ExperienceListFormType,
} from '../../schema';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { Calendar as CalendarIcon, Pen, Trash } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import useExperienceStore from '@/stores/experienceStore';
import { Separator } from '@/components/ui/separator';
import moment from 'moment';
import RichTextEditor from '@/components/RichTextEditor';

import '@/components/RichTextEditor/index.css';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EMPLOYMENT_TYPE } from '@/constants';

const ExperienceList = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [date, setDate] = useState<Date>();
  const [isCurrentlyWork, setIsCurrentlyWork] = useState<'yes' | undefined>(
    undefined
  );
  const [isDeleteExperienceDialogOpen, setIsDeleteExperienceDialogOpen] =
    useState(false);
  const [deleteExperienceDialogProperty, setDeleteExperienceDialogProperty] =
    useState<{ id: string; employer: string; role: string }>({
      id: '',
      employer: '',
      role: '',
    });

  const {
    experiences,
    fetchExperiences,
    deleteExperience,
    addExperience,
    loading,
  } = useExperienceStore();

  const form = useForm<ExperienceListFormType>({
    resolver: zodResolver(experienceListFormSchema),
    defaultValues: {
      employer: '',
      role: '',
      start_date: undefined,
      end_date: undefined,
      location: '',
      description: '',
      employment_type: undefined,
    },
  });

  const onSubmit = async (values: ExperienceListFormType) => {
    const result = await addExperience({ ...values });

    if (result === 201) {
      form.reset({
        description: '',
        employer: '',
        end_date: undefined,
        location: '',
        role: '',
        start_date: undefined,
        employment_type: undefined,
      });
      setIsCurrentlyWork(undefined);
    }
  };

  const handleDeleteExperience = async (experienceId: string) => {
    const status = await deleteExperience(experienceId);

    if (status === 204) {
      setIsDeleteExperienceDialogOpen(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className='space-y-4'>
        <TypographyH3>Experience list</TypographyH3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='experience-form space-y-2'
          >
            <div className='employer'>
              <FormField
                control={form.control}
                name='employer'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer</FormLabel>
                    <FormControl>
                      <Input placeholder='Company' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='role'>
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role or job title</FormLabel>
                    <FormControl>
                      <Input placeholder='Engineer' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='start-date'>
              <FormField
                control={form.control}
                name='start_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start date</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            data-empty={!date}
                            className='data-[empty=true]:text-muted-foreground justify-start text-left font-normal'
                          >
                            <CalendarIcon />
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          captionLayout='dropdown'
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='end-date'>
              <FormField
                control={form.control}
                name='end_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End date</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            data-empty={!date}
                            className='data-[empty=true]:text-muted-foreground justify-start text-left font-normal'
                            disabled={!!isCurrentlyWork}
                          >
                            <CalendarIcon />
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          captionLayout='dropdown'
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex items-center gap-2 mt-2'>
                <Checkbox
                  id='currently-work'
                  checked={isCurrentlyWork === 'yes'}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setIsCurrentlyWork('yes');
                      form.setValue('end_date', undefined);
                    } else {
                      setIsCurrentlyWork(undefined);
                    }
                  }}
                />
                <Label htmlFor='currently-work'>Currently work here</Label>
              </div>
            </div>

            <div className='employment-type'>
              <FormField
                control={form.control}
                name='employment_type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Employment type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EMPLOYMENT_TYPE.map((type) => (
                          <SelectItem value={type.value} key={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='location'>
              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder='City, State' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='description'>
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        {...field}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type='submit' className='add-btn'>
              Add
            </Button>
          </form>
        </Form>

        <Separator />

        <div className='space-y-8'>
          {experiences.map((experience) => (
            <div key={experience.id}>
              <div className='flex justify-between items-center'>
                <TypographyH4 className='w-2/3'>
                  {experience.employer}
                </TypographyH4>

                <div className='space-x-2 w-1/3 text-right'>
                  <Button>
                    <Pen />
                  </Button>
                  <Button
                    variant={'destructive'}
                    onClick={() => {
                      setIsDeleteExperienceDialogOpen(true);
                      setDeleteExperienceDialogProperty({
                        id: experience.id,
                        employer: experience.employer,
                        role: experience.role,
                      });
                    }}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
              <p>
                {experience.role}, {experience.location}
              </p>
              <p>
                {moment(experience.start_date).format('MM/YYYY')} -{' '}
                {experience.end_date
                  ? moment(experience.end_date).format('MM/YYYY')
                  : 'Present'}
              </p>
              <Separator className='my-2' />
              <div
                className='tiptap'
                dangerouslySetInnerHTML={{ __html: experience.description }}
              />
            </div>
          ))}
        </div>
      </div>

      {deleteExperienceDialogProperty.id && (
        <Dialog
          open={isDeleteExperienceDialogOpen}
          onOpenChange={setIsDeleteExperienceDialogOpen}
        >
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Delete Experience</DialogTitle>
              <DialogDescription>
                Are you sure want to delete{' '}
                {deleteExperienceDialogProperty.role} at{' '}
                {deleteExperienceDialogProperty.employer} experience?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogClose>
              <Button
                variant={'destructive'}
                onClick={() => {
                  handleDeleteExperience(deleteExperienceDialogProperty.id);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ExperienceList;
