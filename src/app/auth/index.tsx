import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignInForm from "@/components/container/auth/sign-in";
import SignUpForm from "@/components/container/auth/sign-up";
import { Shield } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center py-4 md:py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-800/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-800/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-800/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center relative z-10 h-full md:h-auto">
        <div className="hidden md:block space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Travel App
              </span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Join thousands of travelers who trust us with their journey.
              Secure, fast, and reliable authentication for your travel
              experiences.
            </p>
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <div className="w-full max-w-md">
            <Card className="shadow-2xl py-3 md:py-5 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-3 md:space-y-4 pb-6 md:pb-8">
                <div className="flex justify-center md:hidden">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl md:text-2xl text-center text-slate-900">
                  <span className="md:hidden block mb-2">Travel App</span>
                  Get Started
                </CardTitle>
                <p className="text-center text-slate-600 text-sm">
                  Choose your preferred method to continue
                </p>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1">
                    <TabsTrigger
                      value="signin"
                      className="data-[state=active]:bg-slate-800 data-[state=active]:text-white font-medium"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="data-[state=active]:bg-slate-800 data-[state=active]:text-white font-medium"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="signin"
                    className="mt-4 md:mt-6 space-y-4"
                  >
                    <div className="text-center mb-4">
                      <h3 className="font-semibold text-slate-900">
                        Welcome back!
                      </h3>
                      <p className="text-sm text-slate-600">
                        Sign in to your account to continue
                      </p>
                    </div>
                    <SignInForm />
                  </TabsContent>
                  <TabsContent
                    value="signup"
                    className="mt-4 md:mt-6 space-y-4"
                  >
                    <div className="text-center mb-4">
                      <h3 className="font-semibold text-slate-900">
                        Create Account
                      </h3>
                      <p className="text-sm text-slate-600">
                        Join us and start your journey today
                      </p>
                    </div>
                    <SignUpForm />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
