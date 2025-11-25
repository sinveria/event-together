const FormInput = ({ label, placeholder, value, onChange, type = "text", isTextarea = false }) => {
    return (
        <div className="mb-2">
            <label className="block text-lg font-medium text-gray-900 mb-2">
                {label}
            </label>
            {isTextarea ? (
                <textarea
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    rows={4}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#323FF0] transition-colors resize-none"
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#323FF0] transition-colors"
                />
            )}
        </div>
    );
};

export default FormInput;