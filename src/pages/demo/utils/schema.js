import * as yup from "yup";

const appointmentSchema = {
  validation: yup.object({
    applicant_name: yup.string().trim().required("Applicant name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    status: yup.string().required("Status is required"),
  }),
  values: (data) => ({
    applicant_name: data?.applicant_name || "",
    email: data?.email || "",
    status: data?.status || "pending",
  }),
};

export default appointmentSchema;
