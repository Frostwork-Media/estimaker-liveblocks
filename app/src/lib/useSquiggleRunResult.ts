import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useEffect } from "react";
import { create } from "zustand";
import { ASTNode, run } from "@quri/squiggle-lang";

/**
 * A store which contains the latest result of running
 * squiggle under the key `runResult`.
 */
export const useSquiggleRunResult = create<{
  runResult: Awaited<ReturnType<typeof run>> | null;
  processedRunResult: ReturnType<typeof processSquiggleResult> | null;
}>((_set) => ({
  runResult: null,
  processedRunResult: null,
}));

/**
 * Internally this runs squiggle code and stores the latest result in some
 * client-side storage. This needs to be called at the root of the try that's
 * using it, i.e. the project or public project.
 */
export function useSquiggleEnv(code: string) {
  const debouncedCode = useDebouncedValue(code, 500);
  useEffect(() => {
    run(debouncedCode)
      .then((runResult) => {
        if (!runResult.ok) {
          if (runResult.value.tag === "compile") {
            throw new Error(runResult.value["_value"]);
          }
          throw new Error("Unknown Compile Error");
        }
        useSquiggleRunResult.setState({
          runResult,
          processedRunResult: processSquiggleResult(runResult),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [debouncedCode]);
}

/**
 * This is a helper function to make it easier to use the result of squiggle
 */
function processSquiggleResult(result: Awaited<ReturnType<typeof run>>) {
  const obj: {
    variables: Record<
      string,
      {
        type: ProcessedSquiggleNodeType;
      }
    >;
  } = {
    variables: {},
  };

  if (result.ok !== true) return null;

  const ast = result.value.result.context?.ast;
  if (!ast) return null;
  if (ast.type !== "Program") return null;

  const { symbols } = ast;

  for (const symbol of Object.values(symbols)) {
    if (symbol.type !== "LetStatement") continue;

    obj.variables[symbol.variable.value] = {
      type: getType(symbol),
    };
  }

  return obj;
}

export type ProcessedSquiggleNodeType = "value" | "distribution" | "function";

function getType(s: ASTNode): ProcessedSquiggleNodeType {
  if (s.type !== "LetStatement") throw new Error("Expected LetStatement");
  if (s.value.type !== "Block") throw new Error("Expected Block");
  if (!s.value.statements.length) throw new Error("Expected statements");
  const statement = s.value.statements[0];
  switch (statement.type) {
    case "Float":
      return "value";
    case "Call":
      return "distribution";
    case "InfixCall":
      if (statement.op === "to") return "distribution";
      return "function";
    case "Identifier":
      return "function";
    default:
      throw new Error(`Unexpected statement type: ${statement.type}`);
  }
}
