import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { formSchema, type formSchemaType } from './schema';

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
import { TypographyH3 } from '@/components/ui/typography';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSignIn = async (values: formSchemaType) => {
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <section className='w-6xl h-screen grid place-items-center'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSignIn)}
          className='space-y-6 w-1/3 border-[1px] shadow-xs rounded p-8'
        >
          <div className='text-center'>
            <TypographyH3>Sign In</TypographyH3>
            <p className='text-sm text-muted-foreground'>
              Sign in to access your personal dashboard and manage your
              portfolio content securely
            </p>

            {error && (
              <div className='p-2 border-2 border-destructive rounded bg-destructive/10 text-destructive capitalize mt-4 text-sm'>
                <p>{error}</p>
              </div>
            )}
          </div>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='example@email.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='••••••••••••••••'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full'>
            Sign In
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default SignInPage;
