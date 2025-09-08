import { Button } from '@/components/ui/button';
import { TypographyH1 } from '@/components/ui/typography';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { experienceFormSchema, type ExperienceFormSchemaType } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import './index.css';
import ExperienceList from './components/ExperienceList';

const CMSExperiences = () => {
  const [isEdit, setIsEdit] = useState(false);

  const form = useForm<ExperienceFormSchemaType>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      description: '',
    },
  });

  const onSubmit = (values: ExperienceFormSchemaType) => {
    console.log(values);
  };

  return (
    <div className='border-[1px] rounded-lg shadow p-8 space-y-4'>
      <div className='flex justify-between items-center'>
        <TypographyH1 className='text-left'>Experiences</TypographyH1>
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

      <ExperienceList />
    </div>
  );
};

export default CMSExperiences;
