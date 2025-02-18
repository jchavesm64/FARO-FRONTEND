export const getRatePlansRestrictions = gql`
  query getRatePlansRestrictions($filters: RatePlanFilter) {
    getRatePlansRestrictions(filters: $filters) {
      status
      data
      message
    }
  }
`;

export const updateRestrictions = gql`
  mutation updateRestrictions($input: [RestrictionInput]) {
    updateRestrictions(input: $input) {
      status
      data
      message
    }
  }
`;
