export const updateRoomTypeMutation = gql`
  mutation UpdateRoomType($id: String, $input: RoomTypeInput!) {
    updateRoomType(id: $id, input: $input) {
      status
      data {
        id
        nombre
        channex {
          propertyId
          countOfRooms
          occAdults
          occChildren
          occInfants
          defaultOccupancy
          facilities
          roomKind
          capacity
          content {
            description
          }
        }
      }
      message
    }
  }
`;

export const createRoomTypeMutation = gql`
  mutation CreateRoomType($input: RoomTypeInput!) {
    createRoomType(input: $input) {
      status
      data {
        id
        nombre
        channex {
          propertyId
          countOfRooms
          occAdults
          occChildren
          occInfants
          defaultOccupancy
          facilities
          roomKind
          capacity
          content {
            description
          }
        }
      }
      message
    }
  }
`;

export const getRoomTypeById = gql`
  query getRoomTypeById($id: String) {
    getRoomTypeById(id: $id) {
      nombre
      descripcion
      precioBase
      estado

      channex {
        propertyId
        roomTypeId
        countOfRooms
        occAdults
        occChildren
        occInfants
        defaultOccupancy
        facilities
        roomKind
        capacity
        content {
          description
          photos {
            url
            position
          }
        }
      }
    }
  }
`;

export const disableRoomTypeMutation = gql`
  mutation DisableRoomType($id: String) {
    disableRoomType(id: $id) {
      status
      message
    }
  }
`;
