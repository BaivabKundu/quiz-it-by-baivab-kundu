import * as yup from "yup";

export const quizTimingSchema = yup.object().shape({
  timing: yup.boolean(),
  hours: yup.number().when("timing", {
    is: true,
    then: yup
      .number()
      .min(0, "Hours must be at least 0")
      .required("Hours are required when timer is enabled"),
    otherwise: yup.number().notRequired(),
  }),
  minutes: yup.number().when("timing", {
    is: true,
    then: yup
      .number()
      .min(1, "Minutes must be between 1 and 59")
      .max(59, "Minutes must be between 1 and 59")
      .required("Minutes are required when timer is enabled"),
    otherwise: yup.number().notRequired(),
  }),
});
