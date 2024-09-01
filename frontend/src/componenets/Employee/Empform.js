import React, { useContext, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./Empform.css"; // Make sure this file includes the necessary styles
import { AuthContext } from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  gender: Yup.string()
    .oneOf(["male", "female"], "Invalid gender")
    .required("Gender is required"),
  designation: Yup.string()
    .oneOf(["HR", "Manager", "Sales"], "Invalid designation")
    .required("Designation is required"),
  course: Yup.string()
    .oneOf(["BCOM", "MCA", "MBA", "OTHERS"], "Invalid course")
    .required("Course is required"),
  mobile: Yup.string()
    .required("Mobile number is required")
    .length(10, "Mobile number must be 10 digits")
    .matches(/^\d+$/, "Mobile number must be a number"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  image: Yup.mixed()
    .required("Image required") // Make it not required
    .test("fileType", "Unsupported File Format", (value) => {
      console.log(value);
      let flag = !value || ["image/png", "image/jpeg"].includes(value.type);
      if (typeof value == "string") {
        flag = true;
      }
      return flag;
    }),
});

const Empform = () => {
  const { state } = useLocation();
  const navigate = useNavigate()
  const employee = state ? state : null;
  const { details } = useContext(AuthContext);
  const [imagePreview, setImagePreview] = useState(
    employee ? `http://localhost:8000/uploads/${employee?.image}` : ""
  );
  console.log({ employee });
  console.log({ imagePreview });
  // useEffect(() => {
  //   if (employee && employee.image) {
  //     setImagePreview(employee.image);
  //   }
  // }, [employee]);

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFieldValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    console.log({ values });
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      if (employee) {
        await axios.put(
          `http://localhost:8000/emp/updateEmp/${employee._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${details.token}`,
            },
          }
        );
        alert("Employee updated successfully");
      } else {
        await axios.post("http://localhost:8000/emp/createEmp", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${details.token}`,
          },
        });
        alert("Employee added successfully");
      }

      resetForm();
      setImagePreview("");
      navigate("/employee")
    } catch (error) {
      console.error(error);
      alert("Failed to submit employee data");
    }
  };

  const initialValues = {
    name: employee?.name || "",
    gender: employee?.gender || "",
    designation: employee?.designation || "",
    course: employee?.course || "",
    mobile: employee?.mobile || "",
    email: employee?.email || "",
    image: employee?.image || "",
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">
          {employee ? "Edit Employee" : "Add Employee"}
        </h1>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              {console.log(values)}

              <div className="form-row">
                <div className="form-group half-width">
                  <label htmlFor="name">Name</label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group half-width">
                  <label htmlFor="designation">Designation</label>
                  <Field
                    as="select"
                    id="designation"
                    name="designation"
                    className="form-input"
                  >
                    <option value="">Select designation</option>
                    <option value="HR">HR</option>
                    <option value="Manager">Manager</option>
                    <option value="Sales">Sales</option>
                  </Field>
                  <ErrorMessage
                    name="designation"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half-width">
                  <label htmlFor="mobile">Mobile</label>
                  <Field
                    type="text"
                    id="mobile"
                    name="mobile"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="mobile"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group half-width">
                  <label htmlFor="email">Email</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half-width">
                  <label htmlFor="course">Course</label>
                  <Field
                    as="select"
                    id="course"
                    name="course"
                    className="form-input"
                  >
                    <option value="">Select course</option>
                    <option value="BCOM">BCOM</option>
                    <option value="MCA">MCA</option>
                    <option value="MBA">MBA</option>
                    <option value="OTHERS">OTHERS</option>
                  </Field>
                  <ErrorMessage
                    name="course"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="form-group half-width">
                  <label>Gender</label>
                  <div className="radio-group">
                    <label>
                      <Field type="radio" name="gender" value="male" />
                      Male
                    </label>
                    <label>
                      <Field type="radio" name="gender" value="female" />
                      Female
                    </label>
                  </div>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="image">Image</label>
                <div className="image-wrapper">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/png, image/jpeg"
                    className="form-input"
                    onChange={(event) =>
                      handleImageChange(event, setFieldValue)
                    }
                  />

                  {imagePreview.startsWith("blob") && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="image-preview"
                    />
                  )}
                  {imagePreview.startsWith("http") && (
                    <img
                      src={`${imagePreview}`}
                      alt="Preview"
                      className="image-preview"
                    />
                  )}
                </div>

                <ErrorMessage
                  name="image"
                  component="div"
                  className="error-message"
                />
              </div>
              <div className="form-submit">
                <button type="submit">
                  {employee ? "Update Employee" : "Add Employee"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Empform;
