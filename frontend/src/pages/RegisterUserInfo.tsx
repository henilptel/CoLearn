import React from "react";
import { Form, Button } from "react-bootstrap";
import TextField from "../components/TextField";
import Select from "../components/Select";
import * as yup from "yup";
import { Formik} from "formik";
import type { FormikProps } from "formik";
import { useNavigate } from "react-router-dom";
import states from "../misc/states";
import languages from "../misc/languages";
import CleanAuthSidebar from "../components/CleanAuthSidebar";

interface FormValues {
  name: string;
  gender: string;
  language: string;
  location: string;
}

const RegisterUserInfo: React.FC = () => {
  const navigate = useNavigate();

  const schema = yup.object({
    name: yup.string().required("This is a required field"),
    gender: yup
      .string()
      .oneOf(["Male", "Female", "Other"], "This is a required field")
      .required("This is a required field"),
    language: yup.string().oneOf(languages, "This is a required field"),
    location: yup.string().oneOf(states, "This is a required field"),
  });

  const initialValues: FormValues = {
    name: "",
    gender: "Gender",
    language: "English",
    location: "Location",
  };

  const handleSubmit = (data: FormValues) => {
    navigate("/register/2", { state: data });
  };

  return (
    <div className="grid-auth">
      <CleanAuthSidebar variant="userinfo" />
      
      <div className="auth-content">
        <div className="auth-form">
          {/* Header */}
          <div className="text-center mb-8 fade-in">
            <div 
              className="d-inline-flex align-items-center justify-content-center mb-4"
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--primary-100)',
                borderRadius: 'var(--radius-xl)',
                color: 'var(--primary-600)',
                fontSize: '1.5rem'
              }}
            >
              👤
            </div>
            <h6 className="fst-italic mb-2" style={{ color: "#9C9AA5" }}>
              1 / 4
            </h6>
            <h1 className="h2 fw-bold mb-3 text-primary" style={{ fontFamily: 'var(--font-family-heading)' }}>
              Tell Us About Yourself
            </h1>
            <p className="text-muted">
              Help us create your skill swap profile
            </p>
          </div>

          {/* Form */}
          <Formik<FormValues>
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {(formikProps: FormikProps<FormValues>) => (
              <Form
                className="slide-up"
                noValidate
                onSubmit={formikProps.handleSubmit}
              >
                <div className="form-group">
                  <TextField
                    name="name"
                    label="Full Name"
                    type="text"
                    value={formikProps.values.name}
                    placeholder="Enter your full name"
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    isValid={formikProps.touched.name && !formikProps.errors.name}
                    isInvalid={
                      formikProps.touched.name && !!formikProps.errors.name
                    }
                    error={formikProps.errors.name}
                    required
                  />
                </div>

                <div className="form-group">
                  <Select
                    name="gender"
                    label="Gender"
                    value={formikProps.values.gender}
                    options={["Male", "Female", "Other"]}
                    placeholder="Select your gender"
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    isValid={
                      formikProps.touched.gender && !formikProps.errors.gender
                    }
                    isInvalid={
                      formikProps.touched.gender && !!formikProps.errors.gender
                    }
                    error={formikProps.errors.gender}
                    required
                  />
                </div>

                <div className="form-group">
                  <Select
                    name="language"
                    label="Preferred Language"
                    value={formikProps.values.language}
                    options={languages}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    isValid={
                      formikProps.touched.language && !formikProps.errors.language
                    }
                    isInvalid={
                      formikProps.touched.language &&
                      !!formikProps.errors.language
                    }
                    error={formikProps.errors.language}
                    required
                  />
                </div>

                <div className="form-group">
                  <Select
                    name="location"
                    label="Location"
                    value={formikProps.values.location}
                    options={states}
                    placeholder="Select your location"
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    isValid={
                      formikProps.touched.location && !formikProps.errors.location
                    }
                    isInvalid={
                      formikProps.touched.location &&
                      !!formikProps.errors.location
                    }
                    error={formikProps.errors.location}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={
                    formikProps.isValidating ||
                    formikProps.isSubmitting ||
                    !(formikProps.isValid && formikProps.dirty)
                  }
                  className="btn btn-primary btn-lg w-100"
                  style={{ height: '48px' }}
                >
                  Continue
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RegisterUserInfo;
