"use client";

import Button from "@/components/ui/buttons/button_1";
import CheckboxInput from "@/components/ui/input/checkbox";
import TextInput from "@/components/ui/input/text";
import Logo from "@/components/ui/logo";
import { useModalAction } from "@/context/modal.context";
import { Switch } from "@headlessui/react";
import axios from "axios";
import clsx from "clsx";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaFacebook, FaLinkedinIn, FaTwitter } from "react-icons/fa";

type VARIANT = "login" | "register";

export default function AuthModal() {
  const [variant, setVariant] = useState<VARIANT>("login");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [proCheck, setProCheck] = useState<boolean>(false);

  useMemo(() => {
    setRemember(false);
    if (variant === "login") {
      setProCheck(false);
    }
  }, [variant]);

  const { closeModal } = useModalAction();
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      if(variant === "register") {
        const res = await axios.post("/api/register", data);
        // TODO: save to context
        console.log(res);
        toast.success("Registered successfully");
      } else {
        const cb = await signIn('credentials', {
          ...data,
          redirect: false
        });
        if (cb?.error) {
          toast.error("Invalid credential");
        } else if (cb?.ok) {
          toast.success(`Logged in as ${data.email}!`);
          closeModal();
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-[720px] lg:w-[920px] xl:w-[1000px] 2xl:w-[1200px] relative">
      <div className="flex mx-auto overflow-hidden rounded-lg bg-brand-light">
        <div className="md:w-1/2 lg:w-[55%] xl:w-[60%] hidden md:block relative">
          <Image src="/img/login.png" alt="signin Image" layout="fill" />
        </div>
        <div className="w-full md:w-1/2 lg:w-[45%] xl:w-[40%] max-h-[570px] py-6 sm:py-10 px-3.5 sm:px-5 md:px-6 lg:px-7 xl:px-11 rounded-md flex flex-col justify-center">
          <div className="mb-6 text-center">
            <div className="flex justify-center">
              <Logo logoOnly={true} />
            </div>
            <h4 className="text-xl font-semibold text-brand-dark sm:text-2xl sm:pt-3 ">
              {variant === "login" ? "Welcome back" : "Signup for free"}
            </h4>
            <div className="mt-3 mb-1 text-sm text-center text-body">
              {variant === "login" ? "Don't have an account" : "Already registered?"}
              <button
                type="button"
                className="text-sm font-semibold ml-1 no-underline hover:text-slate-500"
                onClick={() => {
                  setVariant(variant === "login" ? "register" : "login");
                }}
              >
                {variant === "login" ? "Create an account" : "Sign in"}
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-3.5">
              <TextInput
                id="email"
                label="Email address"
                type="email"
                register={register}
                disabled={isLoading}
                errors={errors}
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
                    value:
                      // regex matches alphanumeric string at least 8 characters long
                      /^[A-Za-z\d]{8,}$/,
                    message:
                      "Password must be at least 8 characters long",
                  },
                }}
              />
              {(variant === "register") && (
                <CheckboxInput
                  id="proCheck"
                  checked={proCheck}
                  onChange={() => setProCheck(!proCheck)}
                  label="I am a landlord or industry professional"
                />
              )}
              <div className={clsx(
                "flex items-center",
                variant === "login" ? "justify-between" : "justify-start")}>
                <div className={variant === "login" ? "block" : "hidden"}>
                  <Switch.Group as="div" className="flex items-center space-x-4">
                    <Switch
                      as="button"
                      checked={remember}
                      onChange={setRemember}
                      className={`${remember ? "bg-indigo-600" : "bg-gray-200"
                        } relative inline-flex flex-shrink-0 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:shadow-outline`}
                    >
                      {({ checked }) => (
                        <span
                          className={`${checked ? "translate-x-5" : "translate-x-0"
                            } inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full`}
                        />
                      )}
                    </Switch>
                    <Switch.Label className="ml-1 text-sm">Remember me</Switch.Label>
                  </Switch.Group>
                </div>
                {variant === "login" ? (
                  <button
                    type="button"
                    className="text-sm text-right no-underline hover:text-slate-500"
                  >
                    Forgot password ?
                  </button>
                ) : (
                  <CheckboxInput
                    id="terms"
                    checked={agreeTerms}
                    onChange={() => setAgreeTerms(!agreeTerms)}
                    label={
                      <p>
                        I agree with the &#32;
                        <Link
                          className="ml-1 text-cyan-600 hover:underline dark:text-cyan-500"
                          href="/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          terms and conditions
                        </Link>
                      </p>
                    }
                  />
                )}
              </div>
              <div className="w-full">
                <div className="mx-auto w-1/2">
                  <Button type="submit" fullWidth disabled={isLoading}>
                    {variant === "login" ? "Sign in" : "Sign up"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
          <div className="relative flex flex-col items-center justify-center text-sm">
            <span className="mt-6 text-sm text-brand-dark opacity-70">
              or continue with
            </span>
          </div>

          <div className="flex justify-center mt-5 space-x-2.5">
            <button
              className="flex items-center justify-center w-10 h-10 transition-all border rounded-full cursor-pointer group border-border-one hover:border-brand focus:border-brand focus:outline-none"
              onClick={() => { }}
            >
              <FaFacebook className="w-4 h-4 text-opacity-50 transition-all text-brand-dark group-hover:text-brand " />
            </button>
            <button
              className="flex items-center justify-center w-10 h-10 transition-all border rounded-full cursor-pointer group border-border-one hover:border-brand focus:border-brand focus:outline-none"
              onClick={() => { }}
            >
              <FaTwitter className="w-4 h-4 text-opacity-50 transition-all text-brand-dark group-hover:text-brand" />
            </button>
            <button
              className="flex items-center justify-center w-10 h-10 transition-all border rounded-full cursor-pointer group border-border-one hover:border-brand focus:border-brand focus:outline-none"
              onClick={() => { }}
            >
              <FaLinkedinIn className="w-4 h-4 text-opacity-50 transition-all text-brand-dark group-hover:text-brand" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// <div className={proCheck ? "flex flex-col space-y-3" : "hidden"}>
// <h3>Professional Information</h3>
// <DropdownInput 
//   id="prof_type" 
//   label="Professional type"
//   control={control}
//   values={[
//     {
//       label: "Landlord",
//       value: "landlord"
//     },
//     {
//       label: "Real estate agent",
//       value: "real_estate_agent"
//     },
//     {
//       label: "Property manager",
//       value: "property_manager"
//     },
//   ]}
//   setValue={setValue}
//   register={register}
//   errors={errors}
//   registerOption={{
//     required: true,
//   }}/>
// <div className="flex flex-row w-full">
//   <TextInput
//     id="first_name"
//     label="First name"
//     type="text"
//     register={register}
//     errors={errors}
//     disabled={isLoading}
//     registerOption={{
//       required: true,
//     }}
//   />
//   <TextInput
//     id="last_name"
//     label="Last name"
//     type="text"
//     register={register}
//     errors={errors}
//     disabled={isLoading}
//     registerOption={{
//       required: true,
//     }}
//   />
// </div>
// <TextInput
//   id="phone"
//   label="Phone number"
//   type="tel"
//   register={register}
//   errors={errors}
//   disabled={isLoading}
//   registerOption={{
//     required: true,
//     pattern: {
//       value: /^\d{10}$/,
//       message: "Invalid phone number",
//     },
//   }}
// />
// </div>
