import React, { useState } from "react";
import { cn } from "@ui/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { Button } from "@ui/components/ui/button";
import { AxiosError } from "axios";
import { useUser } from "../context/user-context";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@ui/components/ui/use-toast";
import { Helmet } from "react-helmet-async";
import { login } from "../services/auth";
// import { client } from "@/lib/client.ts";
// import { ApiValidationSingleError } from "@/lib/Api.ts";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  username: z.string().min(5).max(20),
  password: z.string().min(8).max(127),
});

export function LoginPage({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const { refresh } = useUser();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      await login({
        username: values.username,
        password: values.password,
      });
      refresh();

      toast({
        description: "Login success",
      });

      navigate("/");
    } catch (e) {
      if (e instanceof AxiosError) {
        setIsLoading(false);

        if (e.response && e.response.status === 400) {
          const message = e.response.data.message;

          if (message) {
            setFieldError(message);
          }
        }
      }
    }
  }

  return (
    <>
      <Helmet>Login</Helmet>
      <main className={"absolute w-full min-h-screen card"}>
        <div className={"mx-auto mt-10 max-w-md"}>
          <div className={"primary p-8 shadow-2xl"}>
            <h1 className={"text-xl font-bold text-center mb-4"}>
              ICANDO Assessment Engine
            </h1>
            <div className={cn("grid gap-6", className)} {...props}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name={"username"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder={"Username"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"password"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={"Password"}
                            type={"password"}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fieldError && (
                    <p className={"mt-2 text-red-600 text-sm"}>{fieldError}</p>
                  )}
                  <Button
                    variant={"default"}
                    type={"submit"}
                    disabled={isLoading}
                    className={"mt-6 w-full"}
                  >
                    Login
                  </Button>
                </form>
              </Form>
            </div>

            <p className={"mt-2 text-gray-700"}>
              Registrasi{" "}
              <Link to={"/register"} className={"font-semibold"}>
                di sini
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
