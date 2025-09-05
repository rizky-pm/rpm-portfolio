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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useSkillsState from '@/stores/skillsStore';
import { useEffect, useState } from 'react';

const SkillIcons = () => {
  const [editingSkill, setEditingSkill] = useState<string | null>(null);

  const { skills, fetchSkills, addSkill, updateSkill, deleteSkill } =
    useSkillsState();

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      icon: undefined,
      name: '',
    },
  });

  const onSubmit = async (values: SkillFormData) => {
    if (editingSkill) {
      await updateSkill(editingSkill, values.name, values.icon as File);
      setEditingSkill(null);
    } else {
      await addSkill(values.name, values.icon as File);
    }
    form.reset();
  };

  const handleEdit = (id: string, name: string) => {
    form.reset({ name });
    setEditingSkill(id);
  };

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return (
    <div>
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
                  <Input
                    type='file'
                    accept='image/png,image/jpeg,image/webp,image/svg+xml'
                    className='w-full p-2 border rounded'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full'>
            Save
          </Button>
        </form>
      </Form>

      <div className='grid grid-cols-2 sm:grid-cols-3 gap-6'>
        {skills.map((skill) => (
          <div
            key={skill.id}
            className='border p-4 rounded-xl flex flex-col items-center gap-2 shadow'
          >
            {skill.icon_url && (
              <img
                src={skill.icon_url}
                alt={skill.name}
                className='w-12 h-12 object-contain'
              />
            )}
            <p className='font-medium'>{skill.name}</p>
            <div className='flex gap-2 mt-2'>
              <button
                onClick={() => handleEdit(skill.id, skill.name)}
                className='px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600'
              >
                Edit
              </button>
              <button
                onClick={() => deleteSkill(skill.id)}
                className='px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillIcons;
