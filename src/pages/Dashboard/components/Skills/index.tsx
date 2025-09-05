import { Button } from '@/components/ui/button';
import { TypographyH1 } from '@/components/ui/typography';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { skillsSectionSchema, type SkillsSectionFormData } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
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
import SkillIcons from './components/SkillIcons';
import { Separator } from '@/components/ui/separator';
import useSkillsState from '@/stores/skillsStore';

const CMSSkills = () => {
  const [isEdit, setIsEdit] = useState(false);

  const { updateSection, loading, fetchSection, section } = useSkillsState();

  const form = useForm<SkillsSectionFormData>({
    resolver: zodResolver(skillsSectionSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (values: SkillsSectionFormData) => {
    await updateSection(values.title, values.description);
  };

  useEffect(() => {
    fetchSection();
  }, [fetchSection]);

  useEffect(() => {
    if (section) {
      form.reset({ title: section.title, description: section.description });
    }
  }, [section, form]);

  return (
    <div className='border-[1px] rounded-lg shadow p-8 space-y-4'>
      <div className='flex justify-between items-center'>
        <TypographyH1 className='text-left'>Tech Stack</TypographyH1>
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
                    disabled={!isEdit}
                    {...field}
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

      <Separator />

      <SkillIcons />
    </div>
  );
};

export default CMSSkills;
