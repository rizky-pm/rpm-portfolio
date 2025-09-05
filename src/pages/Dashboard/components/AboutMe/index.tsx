import { TypographyH1 } from '@/components/ui/typography';
import { useForm } from 'react-hook-form';
import { aboutMeFormSchema, type aboutMeFormSchemaType } from './schema';
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
import { Textarea } from '@/components/ui/textarea';
import useAboutMeState from '@/stores/aboutMeStore';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil } from 'lucide-react';

const CMSAboutMe = () => {
  const [isEdit, setIsEdit] = useState(false);

  const { aboutMe, loading, fetchAbout, updateAbout } = useAboutMeState();

  const form = useForm<aboutMeFormSchemaType>({
    resolver: zodResolver(aboutMeFormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (values: aboutMeFormSchemaType) => {
    await updateAbout(values).then(() => setIsEdit(false));
  };

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  useEffect(() => {
    if (aboutMe) {
      form.setValue('title', aboutMe.title);
      form.setValue('description', aboutMe.description);
    }
  }, [aboutMe, form]);

  return (
    <div className='border-[1px] rounded-lg shadow p-8 space-y-4'>
      {loading ? (
        <div className='flex flex-col space-y-4'>
          <Skeleton className='h-10 w-1/3' />
          <Skeleton className='h-3.5 w-1/5' />
          <Skeleton className='h-9 w-full' />
          <Skeleton className='h-3.5 w-1/5' />
          <Skeleton className='h-40 w-full' />
          <Skeleton className='h-9 w-full' />
        </div>
      ) : (
        <>
          <div className='flex justify-between items-center'>
            <TypographyH1 className='text-left'>About Me</TypographyH1>
            <Button
              variant={'ghost'}
              onClick={() => {
                setIsEdit((prevState) => !prevState);
              }}
            >
              <Pencil />
            </Button>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Your title'
                        {...field}
                        disabled={!isEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Your description'
                        maxLength={999}
                        disabled={!isEdit}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full' disabled={!isEdit}>
                Save
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default CMSAboutMe;
