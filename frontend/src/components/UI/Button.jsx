const variants = {
  primary: "btn-primary",
  danger: "btn-danger",
  secondary: "btn-secondary",
};

export default function Button({ children, variant = "primary", className = "", ...props }) {
  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
