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