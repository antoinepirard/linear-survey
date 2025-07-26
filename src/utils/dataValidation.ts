import { Plan, PlanStorage, NotepadDocument } from "@/types/plan";
import { TeamPlanData } from "@/data/teamplan";

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validate a plan object before syncing
export const validatePlan = (plan: Plan): ValidationResult => {
  const errors: ValidationError[] = [];

  // Basic plan validation
  if (!plan.id || typeof plan.id !== "string" || plan.id.trim().length === 0) {
    errors.push({
      field: "id",
      message: "Plan ID is required and must be a non-empty string",
      code: "INVALID_ID",
    });
  }

  if (
    !plan.name ||
    typeof plan.name !== "string" ||
    plan.name.trim().length === 0
  ) {
    errors.push({
      field: "name",
      message: "Plan name is required and must be a non-empty string",
      code: "INVALID_NAME",
    });
  }

  if (plan.name && plan.name.length > 100) {
    errors.push({
      field: "name",
      message: "Plan name must be 100 characters or less",
      code: "NAME_TOO_LONG",
    });
  }

  // Date validation
  if (!(plan.createdAt instanceof Date) || isNaN(plan.createdAt.getTime())) {
    errors.push({
      field: "createdAt",
      message: "Created date must be a valid Date object",
      code: "INVALID_CREATED_DATE",
    });
  }

  if (!(plan.updatedAt instanceof Date) || isNaN(plan.updatedAt.getTime())) {
    errors.push({
      field: "updatedAt",
      message: "Updated date must be a valid Date object",
      code: "INVALID_UPDATED_DATE",
    });
  }

  // Validate teamPlanData structure
  if (!plan.teamPlanData || typeof plan.teamPlanData !== "object") {
    errors.push({
      field: "teamPlanData",
      message: "Team plan data is required and must be an object",
      code: "MISSING_TEAM_PLAN_DATA",
    });
  } else {
    const teamPlanValidation = validateTeamPlanData(plan.teamPlanData);
    errors.push(
      ...teamPlanValidation.errors.map((err) => ({
        ...err,
        field: `teamPlanData.${err.field}`,
      }))
    );
  }

  // Validate notepadData structure
  if (!plan.notepadData || typeof plan.notepadData !== "object") {
    errors.push({
      field: "notepadData",
      message: "Notepad data is required and must be an object",
      code: "MISSING_NOTEPAD_DATA",
    });
  } else {
    const notepadValidation = validateNotepadData(plan.notepadData);
    errors.push(
      ...notepadValidation.errors.map((err) => ({
        ...err,
        field: `notepadData.${err.field}`,
      }))
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate team plan data structure
const validateTeamPlanData = (data: TeamPlanData): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!Array.isArray(data.projects)) {
    errors.push({
      field: "projects",
      message: "Projects must be an array",
      code: "INVALID_PROJECTS",
    });
  } else {
    // Validate each project
    data.projects.forEach((project, index) => {
      if (!project.id || typeof project.id !== "string") {
        errors.push({
          field: `projects[${index}].id`,
          message: "Project ID must be a non-empty string",
          code: "INVALID_PROJECT_ID",
        });
      }
      if (!project.title || typeof project.title !== "string") {
        errors.push({
          field: `projects[${index}].title`,
          message: "Project title must be a non-empty string",
          code: "INVALID_PROJECT_TITLE",
        });
      }
      if (!project.personId || typeof project.personId !== "string") {
        errors.push({
          field: `projects[${index}].personId`,
          message: "Project personId must be a non-empty string",
          code: "INVALID_PROJECT_PERSON_ID",
        });
      }
      if (!project.timeSlotId || typeof project.timeSlotId !== "string") {
        errors.push({
          field: `projects[${index}].timeSlotId`,
          message: "Project timeSlotId must be a non-empty string",
          code: "INVALID_PROJECT_TIME_SLOT_ID",
        });
      }
    });
  }

  if (!Array.isArray(data.people)) {
    errors.push({
      field: "people",
      message: "People must be an array",
      code: "INVALID_PEOPLE",
    });
  } else {
    // Validate each person
    data.people.forEach((person, index) => {
      if (!person.id || typeof person.id !== "string") {
        errors.push({
          field: `people[${index}].id`,
          message: "Person ID must be a non-empty string",
          code: "INVALID_PERSON_ID",
        });
      }
      if (!person.name || typeof person.name !== "string") {
        errors.push({
          field: `people[${index}].name`,
          message: "Person name must be a non-empty string",
          code: "INVALID_PERSON_NAME",
        });
      }
    });
  }

  if (!Array.isArray(data.timeSlots)) {
    errors.push({
      field: "timeSlots",
      message: "Time slots must be an array",
      code: "INVALID_TIME_SLOTS",
    });
  } else {
    // Validate each time slot
    data.timeSlots.forEach((timeSlot, index) => {
      if (!timeSlot.id || typeof timeSlot.id !== "string") {
        errors.push({
          field: `timeSlots[${index}].id`,
          message: "Time slot ID must be a non-empty string",
          code: "INVALID_TIME_SLOT_ID",
        });
      }
      if (!timeSlot.label || typeof timeSlot.label !== "string") {
        errors.push({
          field: `timeSlots[${index}].label`,
          message: "Time slot label must be a non-empty string",
          code: "INVALID_TIME_SLOT_LABEL",
        });
      }
      if (!timeSlot.type || !["week", "month"].includes(timeSlot.type)) {
        errors.push({
          field: `timeSlots[${index}].type`,
          message: 'Time slot type must be either "week" or "month"',
          code: "INVALID_TIME_SLOT_TYPE",
        });
      }
      // startDate and endDate are optional, but if present should be valid dates
      if (
        timeSlot.startDate &&
        (!(timeSlot.startDate instanceof Date) ||
          isNaN(timeSlot.startDate.getTime()))
      ) {
        errors.push({
          field: `timeSlots[${index}].startDate`,
          message:
            "Time slot start date must be a valid Date object if provided",
          code: "INVALID_TIME_SLOT_START_DATE",
        });
      }
      if (
        timeSlot.endDate &&
        (!(timeSlot.endDate instanceof Date) ||
          isNaN(timeSlot.endDate.getTime()))
      ) {
        errors.push({
          field: `timeSlots[${index}].endDate`,
          message: "Time slot end date must be a valid Date object if provided",
          code: "INVALID_TIME_SLOT_END_DATE",
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate notepad data structure
const validateNotepadData = (data: {
  width: number;
  currentDocumentId: string | null;
  documents: Record<string, NotepadDocument>;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof data.width !== "number" || data.width < 200 || data.width > 1200) {
    errors.push({
      field: "width",
      message: "Width must be a number between 200 and 1200",
      code: "INVALID_WIDTH",
    });
  }

  if (
    data.currentDocumentId !== null &&
    typeof data.currentDocumentId !== "string"
  ) {
    errors.push({
      field: "currentDocumentId",
      message: "Current document ID must be a string or null",
      code: "INVALID_CURRENT_DOCUMENT_ID",
    });
  }

  if (!data.documents || typeof data.documents !== "object") {
    errors.push({
      field: "documents",
      message: "Documents must be an object",
      code: "INVALID_DOCUMENTS",
    });
  } else {
    // Validate each document
    Object.entries(data.documents).forEach(([docId, document]) => {
      if (!document.id || typeof document.id !== "string") {
        errors.push({
          field: `documents[${docId}].id`,
          message: "Document ID must be a non-empty string",
          code: "INVALID_DOCUMENT_ID",
        });
      }
      if (
        typeof document.title !== "string" ||
        document.title.trim().length === 0
      ) {
        errors.push({
          field: `documents[${docId}].title`,
          message: "Document title must be a non-empty string",
          code: "INVALID_DOCUMENT_TITLE",
        });
      }
      if (typeof document.content !== "string") {
        errors.push({
          field: `documents[${docId}].content`,
          message: "Document content must be a string",
          code: "INVALID_DOCUMENT_CONTENT",
        });
      }
      if (typeof document.version !== "number" || document.version < 0) {
        errors.push({
          field: `documents[${docId}].version`,
          message: "Document version must be a non-negative number",
          code: "INVALID_DOCUMENT_VERSION",
        });
      }
    });

    // Validate that currentDocumentId references an existing document
    if (data.currentDocumentId && !data.documents[data.currentDocumentId]) {
      errors.push({
        field: "currentDocumentId",
        message: "Current document ID must reference an existing document",
        code: "CURRENT_DOCUMENT_NOT_FOUND",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Basic validation to prevent critical errors
export const basicValidatePlanStorage = (
  storage: PlanStorage
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Only check for critical data structure issues that would cause crashes
  if (!storage || typeof storage !== "object") {
    errors.push({
      field: "storage",
      message: "Storage must be an object",
      code: "INVALID_STORAGE",
    });
    return { isValid: false, errors };
  }

  if (!storage.plans || typeof storage.plans !== "object") {
    errors.push({
      field: "plans",
      message: "Plans must be an object",
      code: "INVALID_PLANS",
    });
  }

  // Ensure currentPlanId references an existing plan if it's set
  if (
    storage.currentPlanId &&
    storage.plans &&
    !storage.plans[storage.currentPlanId]
  ) {
    errors.push({
      field: "currentPlanId",
      message: "Current plan ID must reference an existing plan",
      code: "CURRENT_PLAN_NOT_FOUND",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Keep the original validation for when Jonny needs more strict validation
export const validatePlanStorage = (storage: PlanStorage): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!storage.plans || typeof storage.plans !== "object") {
    errors.push({
      field: "plans",
      message: "Plans must be an object",
      code: "INVALID_PLANS",
    });
    return { isValid: false, errors };
  }

  if (storage.currentPlanId && typeof storage.currentPlanId !== "string") {
    errors.push({
      field: "currentPlanId",
      message: "Current plan ID must be a string or null",
      code: "INVALID_CURRENT_PLAN_ID",
    });
  }

  // Validate each plan
  if (storage.plans) {
    Object.entries(storage.plans).forEach(([planId, plan]) => {
      const planValidation = validatePlan(plan);
      errors.push(
        ...planValidation.errors.map((err) => ({
          ...err,
          field: `plans.${planId}.${err.field}`,
        }))
      );
    });
  }

  // Ensure currentPlanId references an existing plan
  if (
    storage.currentPlanId &&
    storage.plans &&
    !storage.plans[storage.currentPlanId]
  ) {
    errors.push({
      field: "currentPlanId",
      message: "Current plan ID must reference an existing plan",
      code: "CURRENT_PLAN_NOT_FOUND",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Sanitize data before sync (remove any potentially harmful content)
export const sanitizePlanStorage = (storage: PlanStorage): PlanStorage => {
  return {
    ...storage,
    plans: Object.fromEntries(
      Object.entries(storage.plans).map(([id, plan]) => [
        id,
        {
          ...plan,
          name: plan.name
            ? plan.name.trim().substring(0, 100)
            : "Untitled Plan", // Handle undefined/null names
          notepadData: {
            ...plan.notepadData,
            width: plan.notepadData?.width
              ? Math.max(200, Math.min(1200, plan.notepadData.width))
              : 400, // Handle undefined width
            currentDocumentId: plan.notepadData?.currentDocumentId || null,
            documents: plan.notepadData?.documents
              ? Object.fromEntries(
                  Object.entries(plan.notepadData.documents).map(
                    ([docId, document]) => [
                      docId,
                      {
                        ...document,
                        title: document.title
                          ? document.title.trim().substring(0, 100)
                          : "",
                        content:
                          typeof document.content === "string"
                            ? document.content
                            : "",
                        version:
                          typeof document.version === "number"
                            ? Math.max(0, document.version)
                            : 1,
                      },
                    ]
                  )
                )
              : {},
          },
        },
      ])
    ),
  };
};
