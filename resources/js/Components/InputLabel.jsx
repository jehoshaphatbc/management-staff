import Required from '@/Components/Required';

export default function InputLabel({ value, className = '', required, children, ...props }) {
    return (
        <label {...props} className={`block font-medium text-sm text-gray-700 ` + className}>
            {value ? value : children} {required ? <Required/> : ''}
        </label>
    );
}
