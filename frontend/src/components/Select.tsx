import { Form } from "react-bootstrap";

function Select(props) {
  return (
    <Form.Group>
      <Form.Label>
        {props.label}
        {props.required ? <span style={{ color: "red" }}> *</span> : null}
      </Form.Label>
      <Form.Select style={{ borderColor: "#465FF180" }} {...props}>
        <option value={props.placeholder} disabled selected>
          {props.placeholder}
        </option>
        {props.options.map((value) => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {props.error}
      </Form.Control.Feedback>
    </Form.Group>
  );
}

export default Select;
