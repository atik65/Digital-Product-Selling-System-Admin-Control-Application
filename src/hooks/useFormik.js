import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const useFormik = ({ onSubmit, ...props }) => {
  const form = useForm({
    resolver: yupResolver(props.schema || {}),
    defaultValues: props.defaultValues || {},
    values: props.defaultValues || {},
    ...props,
  });

  return { ...form, onSubmit };
};

export default useFormik;
