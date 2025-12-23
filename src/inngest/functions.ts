import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { inngest } from "./client";
import { generateText } from "ai";
import * as Sentry from "@sentry/nextjs";

const google = createGoogleGenerativeAI();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    
    Sentry.logger.info('User triggered tst log', {log_source:
      'sentry_test'
    })
    const { steps } = await step.ai.wrap("gemini-generate-text",
      generateText, 
      {
        model: google("gemini-2.5-flash-preview-09-2025"),
        system: "You are a helpful assistant.",
        prompt: "Intresting fact about Sarajevo?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        
            },
      }
    )

    return steps;
  },
);