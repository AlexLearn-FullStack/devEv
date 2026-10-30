/** biome-ignore-all lint/complexity/useArrowFunction: leave as is */
/** biome-ignore-all lint/suspicious/noPrototypeBuiltins: leave as is */
import type { Schema } from 'mongoose';


const queryUpdateMethods: ('findOneAndUpdate' | 'updateOne' | 'updateMany')[] = [
  'findOneAndUpdate',
  'updateOne',
  'updateMany',
];


const queryReplacementMethods: ('findOneAndReplace' | 'replaceOne')[] = [
  'findOneAndReplace',
  'replaceOne',
];


export function requireDocumentSaveForFieldUpdates(
  schema: Schema,
  fields: readonly string[],
): void {
  schema.pre(queryUpdateMethods, function () {
    const update = this.getUpdate();

    if (Array.isArray(update)) {
      throw new Error('Update pipelines bypass save middleware. Load the document and call save() instead.');
    }

    if (fields.some((field) => updateModifiesPath(update, field))) {
      throw new Error(
        `Query updates cannot modify ${fields.join(', ')}. Load the document and call save() instead.`,
      );
    }
  });

  schema.pre("bulkWrite", function (operations: readonly unknown[]) {
    for (const operation of operations) {
      if (typeof operation !== "object" || operation === null) continue;

      const bulkOperation = operation as Record<string, unknown>;
      const updateOperation =
        bulkOperation.updateOne ?? bulkOperation.updateMany;

      if (typeof updateOperation === "object" && updateOperation !== null) {
        const update = (updateOperation as { update?: unknown }).update;

        if (
          Array.isArray(update) ||
          fields.some((field) => updateModifiesPath(update, field))
        ) {
          throw new Error(
            `Bulk writes cannot modify ${fields.join(", ")}. Load the document and call save() instead.`,
          );
        }
      }

      if (Object.prototype.hasOwnProperty.call(bulkOperation, "replaceOne")) {
        throw new Error(
          "Bulk replacements bypass save middleware. Load the document and call save() instead.",
        );
      }
    }
  });
  
  schema.pre(queryReplacementMethods, () => {
    throw new Error('Query replacements bypass save middleware. Load the document and call save() instead.');
  });
}


function updateModifiesPath(update: unknown, path: string): boolean {
  if (typeof update !== 'object' || update === null) {
    return false;
  }

  return Object.entries(update).some(([key, value]) => {
    if (key === '$rename' && typeof value === 'object' && value !== null) {
      return Object.entries(value).some(
        ([source, destination]) =>
          matchesPath(source, path) ||
          (typeof destination === 'string' && matchesPath(destination, path)),
      );
    }

    if (key.startsWith('$')) {
      return (
        typeof value === 'object' &&
        value !== null &&
        Object.keys(value).some((updatedPath) => matchesPath(updatedPath, path))
      );
    }

    return matchesPath(key, path);
  });
}


function matchesPath(updatedPath: string, path: string): boolean {
  return updatedPath === path || updatedPath.startsWith(`${path}.`);
}