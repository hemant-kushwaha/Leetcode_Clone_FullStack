import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const signupSchema = z.object({
  firstName: z
    .string()
    .min(3, "Firstname should contain at least three characters"),
  emailId: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password should have at least 8 characters")
    .max(32, "Password too long")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one number")
    .regex(/[^A-Za-z0-9]/, "Must include at least one special character"),
})

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) })

  const submittedData = (data) => {
    console.log(data)
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body border rounded-lg border-[#afccdd]">
            <h2 className="card-title justify-center text-3xl">Leetcode</h2>
            <form onSubmit={handleSubmit(submittedData)}>
              <div className="form-control">
                <label className="label mb-1">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  {...register("firstName")}
                  placeholder="hemant"
                  type="text"
                  className={`input input-bordered ${errors.firstName && "input-error"}`}
                />
                {errors.firstName && (
                  <span className="text-error">{errors.firstName.message}</span>
                )}
              </div>

              <div className="form-control mt-4">
                <label className="label mb-1">
                  <span className="label-text">Email</span>
                </label>

                <input
                  {...register("emailId")}
                  type="email"
                  placeholder="hem234@gmail.com"
                  autoComplete="username"
                  className={`input input-bordered ${errors.emailId && "input-error"}`}
                />
                {errors.emailId && (
                  <span className="text-error">{errors.emailId.message}</span>
                )}
              </div>
              <div className="form-control mt-4">
                <label className="label mb-1">
                  <span className="label-text">Password</span>
                </label>

                <input
                  {...register("password")}
                  placeholder="••••••••"
                  className={`input input-bordered ${errors.password && "input-error"}`}
                  type="password"
                  autoComplete="current-password"
                />
                {errors.password && (
                  <span className="text-error">{errors.password.message}</span>
                )}
              </div>
              <div className="form-control mt-6 flex justify-center">
                <button type="submit" className="btn btn-primary">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp
