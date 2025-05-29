import { useState } from "react";

interface Option {
    value: string;
    label: string;
}

interface RadioGroupProps {
    title: string;
    cols?: number;
    options: Option[];
    name: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
    title,
    cols = 1,
    options,
    name,
    defaultValue,
    onChange
}) => {
    const [selectedValue, setSelectedValue] = useState(defaultValue || '');

    const handleChange = (value: string) => {
        setSelectedValue(value);
        onChange?.(value);
    };

    return (
        <div>
            <p className="text-sm font-medium mb-2 text-slate-800">{title}</p>
            <div
                className="grid gap-1 sm:flex-row sm:gap-2"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
                {options.map((option) => (
                    <label
                        key={option.value}
                        className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg border-1 cursor-pointer transition-all duration-300
                        ${selectedValue === option.value
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-input hover:border-primary'
                            }
                    `}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={selectedValue === option.value}
                            onChange={() => handleChange(option.value)}
                        />
                        <span className="text-sm">{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default RadioGroup;
