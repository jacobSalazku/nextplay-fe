'use client';

import { useRouter } from 'next/navigation';
import { submitUpdateUser } from '../actions/update-user';
import { UpdateUserData, updateUserSchema } from '../zod';
import { useMutation } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { UpdateUserDocument } from '@/graphql/graphql';
import { Button } from '@/components/foundation/button/button';
import { Input } from '@/components/foundation/input';
import { RadioGroup } from '@/components/foundation/radio/radio-group';
import { RadioGroupItem } from '@/components/foundation/radio/radio-group-item';

const UserUpdateForm = () => {
  const [runUpdateUser] = useMutation(UpdateUserDocument);
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      phone: '',
      height: 0,
      weight: 0,
      dominantHand: 'Right',
    },
  });

  const onSubmit = async (data: UpdateUserData) => {
    await submitUpdateUser({
      status,
      session,
      data,
      runUpdateUser,
      update,
      router,
      setError,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-xl flex-col gap-8 rounded-lg border border-orange-300/30 bg-gray-950 px-6 py-8"
    >
      <span className="font-righteous w-full text-center text-2xl font-medium text-gray-100">
        Please fill in your details
      </span>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="name"
          label="Name"
          labelColor="light"
          aria-label="Input Name"
          type="text"
          className="w-full text-black"
          placeholder="John Doe"
          error={errors.name}
          errorMessage={errors.name?.message}
          {...register('name')}
          variant="dark"
        />
        <Input
          id="dateOfBirth"
          label="Date of Birth"
          labelColor="light"
          aria-label="Date of Birth"
          type="date"
          className="w-full text-black"
          placeholder="YYYY-MM-DD"
          error={errors.dateOfBirth}
          errorMessage={errors.dateOfBirth?.message}
          {...register('dateOfBirth')}
          variant="dark"
        />
        <Input
          id="phone"
          label="Phone Number"
          labelColor="light"
          aria-label="Phone Number"
          type="tel"
          placeholder="+32 123 456 789"
          className="w-full text-black"
          error={errors.phone}
          errorMessage={errors.phone?.message}
          {...register('phone')}
          variant="dark"
        />
        <div className="flex w-full flex-col gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-white">
            Dominant Hand
          </span>
          <div>
            <RadioGroup className="justify flex flex-row items-center gap-12">
              {['Left', 'Right'].map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <RadioGroupItem
                    {...register('dominantHand')}
                    value={option}
                    className="rounded-full border border-gray-500 bg-white ring-0 focus:ring-0 data-[state=checked]:bg-gray-900"
                    id={`position-${option}`}
                  />
                  <label htmlFor={`position-${option}`} className="text-md">
                    {option}
                  </label>
                </div>
              ))}
            </RadioGroup>
            {errors.dominantHand && <p>{errors.dominantHand.message}</p>}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="height"
          label="Height"
          labelColor="light"
          aria-label="Height"
          type="number"
          step={1}
          className="w-full text-black"
          placeholder="180 cm"
          error={errors.height}
          errorMessage={errors.height?.message}
          {...register('height')}
          variant="dark"
        />
        <Input
          id="weight"
          label="Weight"
          labelColor="light"
          aria-label="Weight"
          type="number"
          step={1}
          className="w-full text-black"
          placeholder="75 kg"
          error={errors.weight}
          errorMessage={errors.weight?.message}
          {...register('weight')}
          variant="dark"
        />
      </div>

      {errors.root?.message ? (
        <p className="text-sm text-red-500">{errors.root.message}</p>
      ) : null}

      <Button
        type="submit"
        variant="outline"
        disabled={isSubmitting || status === 'loading'}
      >
        {isSubmitting ? 'Saving...' : 'Continue'}
      </Button>
    </form>
  );
};

export default UserUpdateForm;
