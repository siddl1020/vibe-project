import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold text-gray-900">
          회원가입
        </h1>
        <SignupForm />
      </div>
    </div>
  );
}
