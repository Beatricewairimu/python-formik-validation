import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

export const SignupForm = () => {
  const [customers, setCustomers] = useState([]);
  const [refreshPage, setRefreshPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetch("/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch(console.error);
  }, [refreshPage]);

  const formSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    name: yup.string().required("Name is required").max(15, "Name must be 15 characters or less"),
    age: yup
      .number()
      .positive("Age must be positive")
      .integer("Age must be a whole number")
      .required("Age is required")
      .typeError("Please enter a valid number")
      .max(125, "Age must be 125 or less"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      age: "",
    },
    validationSchema: formSchema,
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      fetch("/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => {
          if (res.ok) {
            setSubmitSuccess(true);
            resetForm();
            setRefreshPage(!refreshPage);
          } else {
            return res.json().then(err => { throw err; });
          }
        })
        .catch((error) => {
          setSubmitError(error.message || "Failed to submit form");
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Customer Sign Up</h1>
      
      {submitSuccess && (
        <div style={{ color: "green", margin: "10px 0", textAlign: "center" }}>
          Form submitted successfully!
        </div>
      )}

      {submitError && (
        <div style={{ color: "red", margin: "10px 0", textAlign: "center" }}>
          {submitError}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            aria-describedby="emailError"
            style={{ width: "100%", padding: "8px" }}
          />
          {formik.touched.email && formik.errors.email && (
            <p id="emailError" style={{ color: "red", margin: "5px 0 0" }}>
              {formik.errors.email}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            aria-describedby="nameError"
            style={{ width: "100%", padding: "8px" }}
          />
          {formik.touched.name && formik.errors.name && (
            <p id="nameError" style={{ color: "red", margin: "5px 0 0" }}>
              {formik.errors.name}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="age">Age</label>
          <input
            id="age"
            name="age"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.age}
            aria-describedby="ageError"
            style={{ width: "100%", padding: "8px" }}
          />
          {formik.touched.age && formik.errors.age && (
            <p id="ageError" style={{ color: "red", margin: "5px 0 0" }}>
              {formik.errors.age}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !formik.isValid}
          style={{
            width: "100%",
            padding: "10px",
            background: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <h2 style={{ textAlign: "center" }}>Customer List</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ padding: "10px", textAlign: "left" }}>Name</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Email</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Age</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ padding: "10px", textAlign: "center" }}>
                No customers yet
              </td>
            </tr>
          ) : (
            customers.map((customer, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{customer.name}</td>
                <td style={{ padding: "10px" }}>{customer.email}</td>
                <td style={{ padding: "10px" }}>{customer.age}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
