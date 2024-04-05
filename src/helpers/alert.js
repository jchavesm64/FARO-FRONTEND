import Swal from "sweetalert2";


export const infoAlert = (title, message, icon, timer, position)=>{
    Swal.fire({
        title: title,
        text: message,
        timer: timer,
        timerProgressBar: true,
        icon: icon,
        position: position
    }).then((result) => {
    });
}

