import { Field } from '../types/PopUp';

type FormDataValue = string | number | boolean | File | null | undefined;

export const validateFields = (
    fields: Field[],
    formData: Record<string, FormDataValue>
): Record<string, string> => {
    const errors: Record<string, string> = {};

    fields.forEach(field => {
        const value = formData[field.name];

        if (field.required) {
            if (
                value === null ||
                value === undefined ||
                (field.type !== 'file' && String(value).trim() === '')
            ) {
                errors[field.name] = `${field.label} is required`;
            }
        }

        if (field.type === 'file' && value instanceof File) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(value.type)) {
                errors[field.name] = 'Only JPEG, PNG, or GIF images are allowed';
            }
        }
    });

    return errors;
};
