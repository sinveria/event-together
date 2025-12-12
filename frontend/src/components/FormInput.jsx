const FormInput = ({
    label,
    placeholder,
    value,
    onChange,
    type = "text",
    isTextarea = false,
    isSelect = false,
    options = [],
    error,
    required = false,
    disabled = false,
    className = "",
    ...props
}) => {
    const inputClasses = `w-full px-4 py-3 text-lg border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#323FF0] transition-colors ${className} ${error ? 'border-red-500' : ''
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`;

    return (
        <div className="mb-4">
            <label className="block text-lg font-medium text-gray-900 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {isTextarea ? (
                <textarea
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    rows={4}
                    className={inputClasses}
                    disabled={disabled}
                    required={required}
                    {...props}
                />
            ) : isSelect ? (
                <select
                    value={value}
                    onChange={onChange}
                    className={inputClasses}
                    disabled={disabled}
                    required={required}
                    {...props}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map((option) => (
                        <option key={option.value || option.id} value={option.value || option.id}>
                            {option.label || option.name || option.title}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={inputClasses}
                    disabled={disabled}
                    required={required}
                    {...props}
                />
            )}

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default FormInput;