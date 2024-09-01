import "./style.css";

import { useField, ErrorMessage } from "formik";

// import { useMediaQuery } from "react-responsive";

export default function LoginInput({ placeholder, bottom, ...props }) {
  const [field, meta] = useField(props);
  // const desktopView = useMediaQuery({
  //   query: "(min-width: 850px)",
  // });
  return (
    <div className="input_wrap">
    
      <input
        className={meta.touched && meta.error ? "input_error_border" : ""}
        type={field.type}
        name={field.name}
        placeholder={placeholder}
        {...field}
        {...props}
      />
        <div className="input_error1">
        {meta.touched && meta.error && <ErrorMessage name={field.name} />}
      </div>
    </div>
  );
}