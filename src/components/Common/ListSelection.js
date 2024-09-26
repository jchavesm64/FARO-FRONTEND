const ListSection = ({ title, items, label, emptyMessage }) => (
    <label className="fs-5 m-0 ms-4 label_package_color">
        <strong>{title}:</strong>
        {items.length ? (
            <div>
                {items.map((item, index) => (
                    <div key={index} className="ms-5">
                        <span className="fs-5 span_package_color">
                            {label}: <span className="label_package_color">
                                {item.nombre || item.numeroHabitacion || "Sin información"}
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        ) : (
            <span className="fs-5 label_package_color">{emptyMessage}</span>
        )}
    </label>
);

export default ListSection;