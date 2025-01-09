export function sanitizeDataForModel(data: any, modelFields: string[]): any {
  const sanitizedData: any = {};

  modelFields.forEach((field) => {
    if (data[field] !== undefined) {
      sanitizedData[field] = data[field];
    }
  });

  return sanitizedData;
}
