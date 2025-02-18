export const updateAvailabilityMutation = gql`
  mutation updateAvailability($input: DateAvailabilityInput!) {
    updateAvailability(input: $input) {
      status
      message
      data
    }
  }
`;
