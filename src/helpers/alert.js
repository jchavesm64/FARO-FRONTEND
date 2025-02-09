import Swal from "sweetalert2";

export const infoAlert = (title, message, icon, timer, position) => {
  Swal.fire({
    title: title,
    text: message,
    timer: timer,
    timerProgressBar: true,
    icon: icon,
    position: position,
  }).then((result) => {});
};

export const requestConfirmationAlert = (params) => {
  const {
    title,
    bodyText,
    confirmButtonText,
    confirmationEvent,
    CancelEvent,
    showCancelEvent,
  } = params;
  Swal.fire({
    title: title,
    text: bodyText,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      confirmationEvent?.();
      Swal.fire("Guardado!", "Los cambios han sido guardados.", "success");
    } else {
      if (showCancelEvent) {
        CancelEvent?.();
        Swal.fire("Cancelado", "Los cambios no se guardaron.", "info");
      }
    }
  });
};

export const requestConfirmationAlertAsync = (params) => {
  const {
    title,
    bodyText,
    confirmButtonText,
    confirmationEvent,
    asyncConfirmationEvent,
    CancelEvent,
    showCancelEvent,
  } = params;
  Swal.fire({
    title: title,
    text: bodyText,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancelar",
    preConfirm: async () => {
      try {
        await asyncConfirmationEvent?.();
      } catch (error) {
        Swal.fire("Cancelado", "Los cambios no se guardaron.", "info");
      }
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      confirmationEvent?.();
      Swal.fire("Guardado!", "Los cambios han sido guardados.", "success");
    } else {
      if (showCancelEvent) {
        CancelEvent?.();
        Swal.fire("Cancelado", "Los cambios no se guardaron.", "info");
      }
    }
  });
};

export const askForInputAlert = (params) => {
  const { title, bodyText, confirmButtonText, confirmationEvent, CancelEvent } =
    params;
  Swal.fire({
    title: title,
    text: bodyText,
    icon: "warning",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: confirmButtonText,
    cancelButtonText: "Cancelar",
    preConfirm: (reason) => reason,
  }).then((result) => {
    if (result.isConfirmed) {
      confirmationEvent?.(result.value);
      Swal.fire("Guardado!", "Los cambios han sido guardados.", "success");
    }
  });
};
