import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormItem, FormField, FormLabel, FormMessage, } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { SignupValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";


const SignupForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { checkAuthUser, isloading: isUserLoading } = useUserContext();
  
  //const isloading = false
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })

  const { mutateAsync: createUserAccount, isPending: isCreatingUser
  } = useCreateUserAccount();

  const { mutateAsync: signInAccount, isPending: isSigningInUser
  } = useSignInAccount();
  
  //submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values)
    if(!newUser){
      toast({title: "User creation: Sign up failed, Please try again later."})
      return;
    }
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    if(!session){
      toast({title: "Session creation: Sign up failed, Please try again."})
      navigate('/sign-in');
      return;
    }
    else{
      toast({title: "User logged in"})
      
    }

    const isLoggedIn = await checkAuthUser()
    if(isLoggedIn){
      form.reset();
      navigate('/')
      toast({title: "Sign up successfully."})
      return;
    }
    else{
      toast({title: "Loging check: Sign up failed, Please try again later."})
      return;
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="side-project" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">To use side-project enter your details</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            { isCreatingUser|| isSigningInUser || isUserLoading? (
              <div className="flex-center gap-2">
               <Loader /> Loading...
              </div>
            ): "Sign up"}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm