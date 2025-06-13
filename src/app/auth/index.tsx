import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignInForm from "@/components/container/auth/sign-in";
import SignUpForm from "@/components/container/auth/sign-up";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="mt-6">
                <SignInForm />
              </TabsContent>
              <TabsContent value="signup" className="mt-6">
                <SignUpForm />
                <h1>tes</h1>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
