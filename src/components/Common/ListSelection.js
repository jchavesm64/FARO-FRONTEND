const ListSection = ({ title, items, label, icon, emptyMessage, showExtra, showAmount }) => (
    <label className="fs-5 m-0 ms-4 label_package_color">
        <strong className={`${icon} me-1 span_package_color`} />
        <strong>{title}: </strong>
        {items.length ? (
            <div>
                {items.map((item, index) => (
                    <div id={`data${index}`} key={`data${index}`} className="ms-4 col-md-12 " >
                        <span id={`list${item.nombre}${index}`} key={`list${item.nombre}${index}`} className="fs-5 span_package_color" >
                            {label === '•' ? (label) : (`${label}: `)}
                            <span id={`name${item.nombre}`} key={`name${item.nombre}`} className="label_package_color ">
                                {item.nombre || item.numeroHabitacion || item.email || item.telefono || "Sin información"}
                            </span>
                            {showAmount && <span id={`amount${item.nombre}`} key={`amount${item.nombre}`} className="span_package_color">
                                {(item.cantidad !== 0 && item.cantidad !== undefined) && (<span> x{parseInt(item.cantidad) + parseInt(item.extra !== undefined ? item.extra : 0)} </span>)}
                            </span>}
                            {showExtra && <span id={`extra${item.nombre}`} key={`extra${item.nombre}`} className="span_package_color">
                                {(item.extra !== 0 && item.extra !== undefined) && (<span> x{parseInt(item.extra)} </span>)}
                            </span>
                            }
                        </span>
                    </div>
                ))}
            </div>
        ) : (
            <span id="message" key='message' className="fs-5 span_package_color">{emptyMessage}</span>
        )}
    </label>
);

export default ListSection;