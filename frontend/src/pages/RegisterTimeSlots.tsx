"use client"

import type React from "react"
import { Form, Button, InputGroup } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { FieldArray, Formik } from "formik"
import type { FormikProps } from "formik"
import * as yup from "yup"
import { createTimeSlots } from "../apis/session"
import CleanAuthSidebar from "../components/CleanAuthSidebar"

interface TimeSlot {
  start: string
  end: string
}

interface DayAvailability {
  day: string
  enabled: boolean
  slots: TimeSlot[]
}

interface FormValues {
  availability: DayAvailability[]
}

const RegisterTimeSlots: React.FC = () => {
  const navigate = useNavigate()

  const daysOfWeek: string[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]

  const validationSchema = yup.object({
    availability: yup.array().of(
      yup.object({
        day: yup.string().required(),
        slots: yup.array().of(
          yup.object({
            start: yup.string().required("Start time is required"),
            end: yup.string().required("End time is required"),
          }),
        ),
      }),
    ),
  })

  const initialValues: FormValues = {
    availability: daysOfWeek.map((day) => ({
      day,
      enabled: day === "SUNDAY",
      slots: day === "SUNDAY" ? [{ start: "09:00", end: "17:00" }] : [],
    })),
  }

  const handleSubmit = (data: FormValues) => {
    createTimeSlots(data)
      .then(() => navigate("/verification"))
      .catch((err) => console.error(err))
  }

  return (
    <div className="grid-auth">
      <CleanAuthSidebar variant="timeslots" />

      <div className="auth-content">
        <div className="auth-form">
          {/* Header */}
          <div className="text-center mb-8 fade-in">
            <div
              className="d-inline-flex align-items-center justify-content-center mb-4"
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "var(--primary-100)",
                borderRadius: "var(--radius-xl)",
                color: "var(--primary-600)",
                fontSize: "1.5rem",
              }}
            >
              📅
            </div>
            <h6 className="fst-italic mb-2" style={{ color: "#9C9AA5" }}>
              4 / 4
            </h6>
            <h1 className="h2 fw-bold mb-3 text-primary" style={{ fontFamily: "var(--font-family-heading)" }}>
              When Are You Available?
            </h1>
            <p className="text-muted">Help others know when you're free to share and learn together</p>
          </div>

          {/* Form */}
          <Formik<FormValues> validationSchema={validationSchema} initialValues={initialValues} onSubmit={handleSubmit}>
            {({ values, handleSubmit, handleChange }: FormikProps<FormValues>) => (
              <Form onSubmit={handleSubmit} className="slide-up">
                <div className="availability-section">
                  <h3 className="section-title mb-3">When are you available?</h3>
                  <p className="section-description text-muted mb-4">
                    Define your availability for skill sharing. You will receive booking requests in your local
                    timezone.
                  </p>

                  <FieldArray name="availability">
                    {() => (
                      <div style={{ maxHeight: "400px", overflow: "auto" }} className="mb-4">
                        {values.availability.map((day, dayIndex) => (
                          <div key={day.day} className="day-container mb-3 p-3 border rounded">
                            {/* Day toggle switch */}
                            <Form.Check
                              type="switch"
                              id={`availability-${day.day}`}
                              label={day.day}
                              checked={day.enabled}
                              className="mb-3"
                              onChange={() => {
                                const updatedAvailability = [...values.availability]
                                updatedAvailability[dayIndex].enabled = !day.enabled

                                if (updatedAvailability[dayIndex].enabled) {
                                  if (updatedAvailability[dayIndex].slots.length === 0) {
                                    updatedAvailability[dayIndex].slots = [{ start: "", end: "" }]
                                  }
                                } else {
                                  updatedAvailability[dayIndex].slots = []
                                }

                                handleChange({
                                  target: {
                                    name: "availability",
                                    value: updatedAvailability,
                                  },
                                } as any)
                              }}
                            />

                            {/* Time Slots */}
                            {day.enabled && (
                              <FieldArray name={`availability.${dayIndex}.slots`}>
                                {({ push, remove }) => (
                                  <>
                                    {day.slots.map((slot, slotIndex) => (
                                      <div key={slotIndex} className="row align-items-center slot-row mb-2">
                                        <div className="col-5">
                                          <InputGroup>
                                            <Form.Control
                                              type="time"
                                              name={`availability.${dayIndex}.slots.${slotIndex}.start`}
                                              value={slot.start}
                                              onChange={handleChange}
                                            />
                                          </InputGroup>
                                        </div>

                                        <div className="col-5">
                                          <InputGroup>
                                            <Form.Control
                                              type="time"
                                              name={`availability.${dayIndex}.slots.${slotIndex}.end`}
                                              value={slot.end}
                                              onChange={handleChange}
                                            />
                                          </InputGroup>
                                        </div>

                                        <div className="col-2">
                                          <Button variant="outline-danger" size="sm" onClick={() => remove(slotIndex)}>
                                            ×
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                    <Button
                                      variant="link"
                                      className="add-slot-button p-0"
                                      onClick={() => push({ start: "", end: "" })}
                                    >
                                      + Add Slot
                                    </Button>
                                  </>
                                )}
                              </FieldArray>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                </div>

                <Button type="submit" className="btn btn-primary btn-lg w-100" style={{ height: "48px" }}>
                  Complete Registration
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default RegisterTimeSlots
