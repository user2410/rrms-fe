"use client";

import Button from "@components/ui/button";
import TextInput from "@components/ui/input/text";
import clsx from "clsx";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";


export default function AuthForm() {
  const [isLoading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors }, // extract immediately
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setLoading(true);
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            id="email"
            label="Email address"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
            registerOption={{
              required: true,
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Invalid email address",
              },
            }}
          />
          <TextInput
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
            registerOption={{
              required: true,
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character",
              },
            }}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
