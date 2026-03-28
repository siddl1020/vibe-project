import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-14 sm:px-8">
      <div className="w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-9 shadow-sm sm:p-11">
        <p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
          create account
        </p>
        <h1 className="mt-3 text-center text-2xl font-bold tracking-tight text-slate-900">
          회원가입
        </h1>
        <SignupForm />
      </div>
    </div>
  );
}
