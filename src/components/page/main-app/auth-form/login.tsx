import Button from "@/components/ui/buttons/button_2";
import TextInput from "@/components/ui/input/text";
import Logo from "@/components/ui/logo";
import Modal from "@/components/ui/modal";
import { Switch } from "@headlessui/react";
import Image from "next/image";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FaFacebook, FaLinkedinIn, FaTwitter } from "react-icons/fa";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
}: LoginModalProps) {
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [remember, setRemember] = React.useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: any) => { 
    setLoading(true);
    console.log(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full md:w-[720px] lg:w-[920px] xl:w-[1000px] 2xl:w-[1200px] relative">
        <div className="flex mx-auto overflow-hidden rounded-lg bg-brand-light">
          <div className="md:w-1/2 lg:w-[55%] xl:w-[60%] hidden md:block relative">
            <Image src="/img/login.png" alt="signin Image" layout="fill" />
          </div>
          <div className="w-full md:w-1/2 lg:w-[45%] xl:w-[40%] py-6 sm:py-10 px-4 sm:px-8 md:px-6 lg:px-8 xl:px-12 rounded-md flex flex-col justify-center">
            <div className="mb-6 text-center">
              <div>
                <Logo logoOnly={true} />
              </div>
              <h4 className="text-xl font-semibold text-brand-dark sm:text-2xl sm:pt-3 ">
                Welcome back
              </h4>
              <div className="mt-3 mb-1 text-sm text-center text-body">
                Don't have an account
                <button
                  type="button"
                  className="text-sm font-semibold ml-1 no-underline hover:text-slate-500"
                  onClick={() => { }}
                >
                  Create an account
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
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                      message:
                        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character",
                    },
                  }}
                />
                <div className="flex items-center justify-between">
                  <div className="">
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
                  <button
                    type="button"
                    className="text-sm text-right no-underline hover:text-slate-500"
                  >
                    Forgot password ?
                  </button>
                </div>
                <div className="relative">
                  <Button
                    type="submit"
                    // loading={isLoading}
                    // disabled={isLoading}
                    className="w-full mt-2 tracking-normal h-11 md:h-12 font-15px md:font-15px"
                    variant="formButton"
                  >
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
            <div className="relative flex flex-col items-center justify-center text-sm">
              <span className="mt-6 text-sm text-brand-dark opacity-70">
                OR
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
    </Modal>
  );
}
