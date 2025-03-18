import { HTMLInputAutoCompleteAttribute } from "react";

const LabelInput = ({ id, type, labelText, autoComplete, required, placeHolder }:
    { id: string, type?: React.HTMLInputTypeAttribute, labelText: string, autoComplete?: HTMLInputAutoCompleteAttribute, required?: boolean, placeHolder?: string }) => {
    if (!required) required = true;
    return <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{labelText}</label>
        <input name={id} id={id} className="x-input-primary" placeholder={placeHolder ? placeHolder : labelText} required={required} type={type} autoComplete={autoComplete} />
    </div>
}

export { LabelInput }