const ListSection = ({ title, items, label, icon, emptyMessage, showExtra }) => (
    <label className="fs-5 m-0 ms-4 label_package_color">
        <strong className={`${icon} me-1 span_package_color`} />
        <strong>{title}: </strong>
        {items.length ? (
            <div>
                {items.map((item, index) => (
                    <div key={index} className="ms-4 col-md-12 " >
                        <span className="fs-5 span_package_color" >
                            {label === '•' ? (label) : (`${label}: `)}
                            <span className="label_package_color ">
                                {item.nombre || item.numeroHabitacion || item.email || item.telefono || "Sin información"}
                            </span>
                            <span className="span_package_color">
                                {(item.cantidad !== 0 && item.cantidad !== undefined) && (<span> x{parseInt(item.cantidad) + parseInt(item.extra !== undefined ? item.extra : 0)} </span>)}
                            </span>
                            {showExtra && <span className="span_package_color">
                                {(item.extra !== 0 && item.extra !== undefined) && (<span> x{parseInt(item.extra)} </span>)}
                            </span>
                            }

                        </span>
                    </div>
                ))}
            </div>
        ) : (
            <span className="fs-5 span_package_color">{emptyMessage}</span>
        )}
    </label>
);

export default ListSection;