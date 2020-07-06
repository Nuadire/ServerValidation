import "./RegistrationForm.scss";
import React from "react";
import { Formik, FieldArray, ErrorMessage } from "formik";
import { Input, Checkbox, Button } from "antd"; // Space
import * as Yup from "yup";
import PropTypes from "prop-types";

const NAME = "name";
const PASSWORD = "password";
const CONFIRM_PASSWORD = "confirmPassword";
const EMAIL = "email";
const WEBSITE = "website";
const AGE = "age";
const SKILLS = "skills";
const ACCEPT_TERMS = "acceptTerms";
const MIN_AGE = 18;
const MAX_AGE = 65;
const passRegExp = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]/;
const uniqueId = ((idCounter) => () => {
  // eslint-disable-next-line no-param-reassign
  idCounter += 1;
  return idCounter;
})(0);

const validationSchema = Yup.object({
  name: Yup.string().max(50, "To Long!").required("Required"),
  password: Yup.string()
    .min(8, "To Short!")
    .max(40, "To Long!")
    .matches(
      passRegExp,
      "Latin letters and numbers, at least one number and one capital letter"
    )
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref(PASSWORD), null], "Password must mutch")
    .required("Required"),
  email: Yup.string().email().required("Required"),
  website: Yup.string().url(),
  age: Yup.number().integer().min(MIN_AGE).max(MAX_AGE).required("Required"),
  // skills: Yup.array().of(Yup.object()),
  skills: Yup.array().of(Yup.object()),
  acceptTerms: Yup.bool().oneOf([true], "Need to accept"),
});

const getSkills = (values) => ({ push, remove, replace }) => {
  return (
    <>
      <div className="skills-container">
        {values.skills.map(({ name = "", id = uniqueId() }, index) => (
          <div key={id} className="skills-skill">
            <Input
              name={SKILLS}
              value={name}
              onChange={({ target: { value } }) => {
                replace(index, { id, name: value });
              }}
            />
            <Button
              onClick={() => {
                remove(index);
              }}
            >
              -
            </Button>
          </div>
        ))}
      </div>
      <Button onClick={() => push({})}>Add a skill</Button>
    </>
  );
};

getSkills.propTypes = {
  push: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
};

const returnHandleSubmit = async (values, { setStatus }) => {
  const skillsArr = values.skills.reduce((acc, skill) => {
    if (skill.name) {
      acc.push(skill.name);
    }
    return acc;
  }, []);
  const result = { ...values, skills: skillsArr };
  try {
    const response = await fetch("http://127.0.0.1:4000/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(result),
    });
    const { code, message } = await response.json();
    if (code === 0) {
      setStatus({ email: message });
    }
    if (code === 1) {
      setStatus({ message });
    }
  } catch (error) {
    setStatus({ message: "Error: contact administrator" });
  }
};
export const RegistrationForm = () => {
  return (
    <Formik
      initialValues={{
        name: "",
        password: "",
        confirmPassword: "",
        email: "",
        website: "",
        age: "",
        skills: [{}],
        acceptTerms: false,
      }}
      validationSchema={validationSchema}
      onSubmit={returnHandleSubmit}
    >
      {({ handleSubmit, handleChange, handleBlur, values, status }) => {
        return (
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor={NAME}>Name</label>
              <Input
                id={NAME}
                name={NAME}
                placeholder="Name"
                maxLength={50}
                value={values[NAME]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage component="div" name={NAME} />
            </div>
            <div className="form-group">
              <label htmlFor={PASSWORD}>Password</label>
              <Input.Password
                id={PASSWORD}
                name={PASSWORD}
                placeholder="Password"
                maxLength={40}
                value={values[PASSWORD]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name={PASSWORD} />
            </div>
            <div className="form-group">
              <label htmlFor={CONFIRM_PASSWORD}>Confirm password</label>
              <Input.Password
                id={CONFIRM_PASSWORD}
                name={CONFIRM_PASSWORD}
                placeholder="Confirm password"
                maxLength={40}
                value={values[CONFIRM_PASSWORD]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name={CONFIRM_PASSWORD} />
            </div>
            <div className="form-group">
              <label htmlFor={EMAIL}>Email</label>
              <Input
                id={EMAIL}
                name={EMAIL}
                placeholder="email"
                value={values[EMAIL]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {status && status.email ? (
                <div>{status.email}</div>
              ) : (
                <ErrorMessage name={EMAIL} />
              )}
            </div>
            <div className="form-group">
              <label htmlFor={WEBSITE}>Website</label>
              <Input
                id={WEBSITE}
                name={WEBSITE}
                placeholder="Website"
                value={values[WEBSITE]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name={WEBSITE} />
            </div>
            <div className="form-group">
              <label htmlFor={AGE}>Age</label>
              <Input
                id={AGE}
                name={AGE}
                type="number"
                placeholder="Age"
                value={values[AGE]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name={AGE} />
            </div>
            <div className="form-group">
              <span className="skills-label">Skills</span>
              <FieldArray name={SKILLS} render={getSkills(values)} />
              <ErrorMessage name={SKILLS} />
            </div>
            <div className="form-group">
              <Checkbox
                id={ACCEPT_TERMS}
                name={ACCEPT_TERMS}
                checked={values[ACCEPT_TERMS]}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                Accept Terms
              </Checkbox>
              <ErrorMessage name={ACCEPT_TERMS} />
            </div>

            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            {status && status.message && <div>{status.message}</div>}
          </form>
        );
      }}
    </Formik>
  );
};
