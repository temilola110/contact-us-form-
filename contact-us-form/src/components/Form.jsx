import { useState } from "react";
import axios from "axios";
import "../styles/Form.css";

const INITIAL_STATE = {
  name: "",
  email: "",
  subject: "",
  comment: "",
};

export default function Form() {
  const [form, setForm] = useState(INITIAL_STATE);
  const [successful, setSuccessful] = useState(false);
  const [Error, setError] = useState(false);
  const [Loading, setLoading] = useState(false);

  const VALIDATION = {
    name: [
      {
        isValid: (value) => !!value,
        message: "Required *",
      },
    ],
    email: [
      {
        isValid: (value) => !!value,
        message: "Required *",
      },
      {
        isValid: (value) =>
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value),
        message: "Invalid email ",
      },
    ],
    comment: [
      {
        isValid: (value) => !!value,
        message: "Required *",
      },
    ],
  };

  const getErrorFields = (form) =>
    Object.keys(form).reduce((acc, key) => {
      if (!VALIDATION[key]) return acc;
      const errorsPerField = VALIDATION[key]
        .map((validation) => ({
          isValid: validation.isValid(form[key]),
          message: validation.message,
        }))
        .filter((errorPerField) => !errorPerField.isValid);
      return { ...acc, [key]: errorsPerField };
    }, {});

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const hasErrors = Object.values(errorFields).flat().length > 0;
    if (hasErrors) return;

    try {
      setTimeout(setLoading(!Loading), 2000);
      const response = await axios.post(
        "https://my-json-server.typicode.com/tundeojediran/contacts-api-server/inquiries",
        form
      );
      console.log(response.data);
      setSuccessful(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(Loading);
    }
    setForm(INITIAL_STATE);
  };

  const errorFields = getErrorFields(form);

  return (
    <main>
      <h1>Contact us</h1>

      <form onSubmit={handleSubmit}>
        {successful && (
          <p className="submission">Your Inquiry was submitted successfully</p>
        )}
        {Error && (
          <p className="submission">
            Your Inquiry submission was not successful
          </p>
        )}
        <div className="input">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={handleChange}
          />
          {errorFields.name?.length ? (
            <span>{errorFields.name[0].message}</span>
          ) : null}
        </div>
        <div className="input">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            value={form.email}
            onChange={handleChange}
          />
          {errorFields.email?.length ? (
            <span>{errorFields.email[0].message}</span>
          ) : null}
        </div>
        <div className="input">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            type="text"
            value={form.subject}
            onChange={handleChange}
          />
        </div>
        <div className="input">
          <label htmlFor="comment">Message</label>
          <textarea
            id="comment"
            rows="8"
            value={form.comment}
            onChange={handleChange}
          ></textarea>
          {errorFields.comment?.length ? (
            <span>{errorFields.comment[0].message}</span>
          ) : null}
        </div>
        <button type="submit">{Loading ? "Submitting..." : "Submit"}</button>
      </form>
    </main>
  );
}
