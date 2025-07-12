"use client"

import type React from "react"
import { Form, Button, InputGroup } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { FieldArray, Formik } from "formik"
import type { FormikProps } from "formik"
import * as yup from "yup"
import { createTimeSlots } from "../apis/session"
import { userAPI } from "../apis/user"
import CleanAuthSidebar from "../components/CleanAuthSidebar"
import { useAvailabilityRegistration, useRegistration, useBasicRegistration, useProfessionRegistration, useUserInfoRegistration, useBioRegistration } from "../contexts/RegistrationContext"

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
  const { data: registrationData, updateData, completeRegistration } = useAvailabilityRegistration()
  const { data: basicData } = useBasicRegistration()
  const { data: userInfoData } = useUserInfoRegistration()
  const { data: professionData } = useProfessionRegistration()
  const { data: bioData } = useBioRegistration()

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
    availability: registrationData?.availability || daysOfWeek.map((day) => ({
      day,
      enabled: day === "SUNDAY",
      slots: day === "SUNDAY" ? [{ start: "09:00", end: "17:00" }] : [],
    })),
  }

  const handleSubmit = async (data: FormValues) => {
    try {
      console.log('Starting final registration step...');
      
      // Transform the data to match the context structure
      const transformedAvailability = data.availability.map(dayData => ({
        day: dayData.day,
        enabled: dayData.enabled,
        slots: dayData.slots.map(slot => ({
          day: dayData.day,
          start: slot.start,
          end: slot.end,
        }))
      }));

      // Save availability data to context
      updateData({
        availability: transformedAvailability,
      });

      // First, try to authenticate the user if not already authenticated
      try {
        const authStatus = await userAPI.checkAuthStatus();
        if (!authStatus.data.authenticated) {
          console.log('User not authenticated, attempting login...');
          
          if (basicData?.email && basicData?.password) {
            const loginResponse = await userAPI.login({
              email: basicData.email,
              password: basicData.password
            });
            
            if (loginResponse.data.message !== "Logged in successfully") {
              throw new Error('Authentication failed');
            }
            console.log('User authenticated successfully');
          } else {
            throw new Error('No authentication credentials available');
          }
        }
      } catch (authError) {
        console.error('Authentication error:', authError);
        
        // If authentication fails, try to complete the profile update without time slots first
        console.log('Attempting to update profile without time slots...');
        
        const profileUpdateData = {
          // From user info step
          location: userInfoData?.location,
          
          // From profession step
          skillsOffered: professionData?.skillsOffered || [],
          skillsWanted: professionData?.skillsWanted || [],
          
          // From bio step
          bio: bioData?.bio,
          isPublic: true,
          
          // From basic data
          name: `${basicData?.firstName} ${basicData?.lastName}`,
        };

        try {
          await userAPI.updateProfile(profileUpdateData);
          console.log('Profile updated successfully without time slots');
        } catch (profileError) {
          console.log('Profile update failed, trying complete registration...');
          
          // Final fallback: try complete registration endpoint
          const completeRegistrationData = {
            email: basicData?.email,
            password: basicData?.password,
            firstName: basicData?.firstName,
            lastName: basicData?.lastName,
            name: `${basicData?.firstName} ${basicData?.lastName}`,
            ...profileUpdateData,
          };

          await userAPI.registerUser(completeRegistrationData);
          console.log('Complete registration successful');
        }
        
        // Skip time slots creation if authentication failed
        console.log('Skipping time slots creation due to authentication issues');
        completeRegistration();
        navigate("/");
        return;
      }

      // Try to create time slots if user is authenticated
      try {
        await createTimeSlots(data);
        console.log('Time slots created successfully');
      } catch (timeSlotsError) {
        console.error('Time slots creation failed:', timeSlotsError);
        // Don't fail the entire registration if time slots fail
        console.log('Continuing without time slots...');
      }

      // Mark registration as complete
      completeRegistration();
      
      // Clear registration data from localStorage after successful completion
      localStorage.removeItem('registration_flow_data');
      
      // Navigate to success page or dashboard
      navigate("/");
    } catch (err) {
      console.error('Failed to complete registration:', err);
      
      // Even if there's an error, try to navigate to avoid being stuck
      // The user can always update their profile later
      navigate("/");
    }
  }

  return (
    <div className="grid-auth">
      <CleanAuthSidebar variant="schedule" />

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
