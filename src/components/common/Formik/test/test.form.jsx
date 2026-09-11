"use client";

import { Eye } from "lucide-react";
import useFormik from "@/hooks/useFormik";
// import forgotPasswordSchema from "../utils/schema";
import forgotPasswordSchema from "./utils/schmea";
import FormActionButton from "../FormActionButton";
import FieldInput from "../FieldInput";
import FormikWrapper from "../FormikWrapper";
import { useState } from "react";

export default function TestForm() {
  const [step, setStep] = useState(1);
  const form = useFormik({
    schema: forgotPasswordSchema.resetPasswordValidation,
    defaultValues: forgotPasswordSchema.values(),
    onSubmit,
  });
  const { isDirty, isSubmitting, isValid } = form.formState;

  async function onSubmit(data) {
    console.log("data = ", data);
  }

  return (
    <div className="space-y-4">
      <FormikWrapper form={form} onSubmit={onSubmit}>
        <div className="space-y-5">
          <div className="space-y-2">
            <FieldInput
              required
              autoComplete="on"
              type="password"
              name="password"
              placeholder="Enter your Password"
              label={"Password"}
              form={form}
              icon={<Eye />}
            />
            <FieldInput
              required
              autoComplete="on"
              type="password"
              name="confirmPassword"
              placeholder="Enter your Password"
              label={"Confirm Password"}
              form={form}
              icon={<Eye />}
            />
          </div>

          <FormActionButton
            {...{
              classNames: "",
              isDirty,
              isSubmitting,
              isValid,
              label: step === 1 ? "Submit" : "Submit",
              submittingLabel:
                step === 1 ? "Verifying..." : "Resetting Password...",
            }}
          />
        </div>
      </FormikWrapper>
    </div>
  );
}
