import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormItem, FormField, FormLabel, FormMessage, } from "@/components/ui/form";

import { SigninValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";


const SigninForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  
  //const isloading = false
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutateAsync: signInAccount, isPending: isSigningInUser
  } = useSignInAccount();
  
  //submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    if(!session){
      toast({title: "Session creation: Sign up failed, Please try again."})
      navigate('/sign-in');
      return;
    }
    const isLoggedIn = await checkAuthUser()
    if(isLoggedIn){
      form.reset();
      navigate('/')
      toast({title: "Signed in successfully."})
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
        <img src="/assets/images/new-logo.png" alt="side-project" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Login to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Glad to see you here, please enter your details...
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email address</FormLabel>
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
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            { isSigningInUser || isUserLoading ?  (
              <div className="flex-center gap-2">
               <Loader /> Loading...
              </div>
            ): "Sign in"}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm