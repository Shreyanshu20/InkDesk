function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-text mb-1">{title}</h1>
      <p className="text-sm text-text/60">{subtitle}</p>
    </div>
  );
}

export default PageHeader;